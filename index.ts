import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ProcessRequest {
  taskId: string;
  action: 'start' | 'multi-agent';
}

async function callOpenAI(openaiApiKey: string, systemPrompt: string, userPrompt: string, maxTokens: number = 2000) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openaiApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      max_tokens: maxTokens,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || 'OpenAI API error');
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || 'No response generated';
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');

    if (!openaiApiKey) {
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { taskId, action } = await req.json() as ProcessRequest;

    if (!taskId) {
      return new Response(
        JSON.stringify({ error: 'Task ID required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get task details
    const { data: task, error: taskError } = await supabase
      .from('tasks')
      .select('*, business:profiles!tasks_business_id_fkey(*), agent:agents(*)')
      .eq('id', taskId)
      .single();

    if (taskError || !task) {
      return new Response(
        JSON.stringify({ error: 'Task not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'start') {
      // Single agent processing (original logic)
      const systemPrompt = `You are an AI agent working on Neurolance, a platform for autonomous task completion.
You have been hired to complete the following task. Provide a comprehensive, helpful response that addresses all requirements.
Be professional, thorough, and practical in your work.

Task Category: ${task.category}
Task Budget: $${task.budget}`;

      const userPrompt = `Task Title: ${task.title}

Task Description:
${task.description}

Please complete this task to the best of your ability. Provide detailed, actionable results.`;

      // Update task status to processing
      await supabase
        .from('tasks')
        .update({ status: 'in_progress' })
        .eq('id', taskId);

      // Create a processing submission
      const { data: submission } = await supabase
        .from('submissions')
        .insert({
          task_id: taskId,
          agent_id: task.agent_id,
          content: '🔄 AI Agent is analyzing the task requirements...',
          status: 'pending',
        })
        .select()
        .single();

      const aiContent = await callOpenAI(openaiApiKey, systemPrompt, userPrompt, 4096);

      // Update submission with AI result
      if (submission) {
        await supabase
          .from('submissions')
          .update({
            content: aiContent,
            status: 'pending',
          })
          .eq('id', submission.id);
      }

      // Update task status to submitted (ready for review)
      await supabase
        .from('tasks')
        .update({ status: 'submitted' })
        .eq('id', taskId);

      return new Response(
        JSON.stringify({
          success: true,
          status: 'completed',
          result: aiContent,
          submissionId: submission?.id,
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'multi-agent') {
      // Multi-agent collaboration workflow
      // Phase 1: Research Agent
      const researchPrompt = `You are a Research Agent on Neurolance. Your role is to gather relevant information for the given task.
Be thorough and systematic. Identify key concepts, gather context, and analyze requirements.

Task: ${task.title}
Description: ${task.description}
Category: ${task.category}

Provide a comprehensive research summary that identifies:
1. Key concepts and terms
2. Relevant background information
3. Important considerations
4. Recommended approach
5. Data or references needed`;

      // Update task status
      await supabase
        .from('tasks')
        .update({ status: 'in_progress' })
        .eq('id', taskId);

      // Phase 2: Writer Agent (after research)
      const researchOutput = await callOpenAI(openaiApiKey,
        "You are a specialized Research Agent that provides detailed research and analysis.",
        researchPrompt,
        2000
      );

      const writerPrompt = `You are a Writer Agent on Neurolance. Using the research provided, create comprehensive, well-structured content.

Task: ${task.title}
Category: ${task.category}

Research Summary:
${researchOutput}

Create polished, professional content that:
1. Addresses all task requirements
2. Uses clear, organized structure
3. Provides actionable insights
4. Is comprehensive yet concise
5. Maintains professional tone`;

      const writingOutput = await callOpenAI(openaiApiKey,
        "You are a skilled Writer Agent that creates professional, high-quality content.",
        writerPrompt,
        3000
      );

      // Phase 3: Reviewer Agent
      const reviewerPrompt = `You are a Reviewer Agent on Neurolance. Review and improve the content for quality, accuracy, and clarity.

Task: ${task.title}
Category: ${task.category}

Draft Content:
${writingOutput}

Review and improve the content by:
1. Enhancing clarity and readability
2. Ensuring factual accuracy
3. Improving structure and flow
4. Fixing any errors or inconsistencies
5. Adding valuable insights where appropriate

Provide the final, polished version of the content.`;

      const finalOutput = await callOpenAI(openaiApiKey,
        "You are a meticulous Reviewer Agent that ensures content quality and accuracy.",
        reviewerPrompt,
        4096
      );

      // Create submission with multi-agent output
      const { data: submission } = await supabase
        .from('submissions')
        .insert({
          task_id: taskId,
          agent_id: task.agent_id,
          content: finalOutput,
          status: 'pending',
        })
        .select()
        .single();

      // Update task status
      await supabase
        .from('tasks')
        .update({ status: 'submitted' })
        .eq('id', taskId);

      return new Response(
        JSON.stringify({
          success: true,
          status: 'completed',
          result: finalOutput,
          research: researchOutput,
          writing: writingOutput,
          final: finalOutput,
          submissionId: submission?.id,
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Edge function error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
