import { AnalyzeDataFunction } from "./AnalyzeData";
import { AgentFunctionBase } from "./utils";
import { Agent } from "../agents/utils";
import { AgentFunctionResult, AgentOutputType, ChatMessageBuilder } from "@/agent-core";

interface ReadAndAnalyzePDFDataParameters {
  path: string;
  question: string;
}

export class ReadAndAnalyzePDFDataFunction extends AgentFunctionBase<ReadAndAnalyzePDFDataParameters> {
  name: string = "readAndAnalyzePDFData";
  description: string = "Read and analyze PDF documents to answer questions. Returns a comprehensive summary of all relevant details. Only use on PDF files";
  parameters: any = {
    type: "object",
    properties: {
      path: {
        type: "string",
        description: "Path to the PDF document"
      },
      question: {
        type: "string",
        description: "The question your analysis is trying to answer"
      }
    },
    required: ["path", "question"],
    additionalProperties: false
  }

  buildExecutor(agent: Agent<unknown>): (params: ReadAndAnalyzePDFDataParameters, rawParams?: string | undefined) => Promise<AgentFunctionResult> {
    return async (params: ReadAndAnalyzePDFDataParameters, rawParams?: string): Promise<AgentFunctionResult> => {
      const analyzeData = new AnalyzeDataFunction(agent.context.llm, agent.context.chat.tokenizer);

      const data = await agent.context.workspace.readFile(params.path);
      const summary = await analyzeData.analyze({ data, question: params.question }, agent.context);
      const variable = await agent.context.variables.save("pdfDocument", data);

      return {
        outputs: [
          {
            type: AgentOutputType.Success,
            title: `[${agent.config.prompts.name}] ${this.name}`,
            content: `PDF Document Stored in Variable: \${${variable}}\nAnalysis Summary:\n\`\`\`\n${summary}\n\`\`\``
          }
        ],
        messages: [
          ChatMessageBuilder.functionCall(this.name, params),
          ChatMessageBuilder.functionCallResult(this.name, `\${${variable}}`),
          ChatMessageBuilder.functionCallResult(this.name, `PDF Document Stored in Variable: \${${variable}}\nAnalysis Summary:\n\`\`\`\n${summary}\n\`\`\``),
        ]
      };
    }
  }
}
