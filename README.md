
### Agent Personas

| Agent | Expertise |
|-|-|
| 📝[Synthesizer](./packages/agents/src/agents/Synthesizer/index.ts) | "Reads text files, analyzing and gathering data and information from text files, generating summaries and reports, and analyzing text." |
| #️⃣ [Csv Analyst](./packages/agents/src/agents/CsvAnalyst/index.ts) | "Adept at reading CSV files, searching for data, extracting key data points, calculating amounts, and derive insights from CSV files." |
| 🌐 [Researcher](./packages/agents/src/agents/Researcher/index.ts) | "Searching the internet, comprehending details, and finding information." |
| 💻 [Developer](./packages/agents/src/agents/Developer/index.ts) | "Architect and build complex software. specialized in python." |


1. **Predict Next Step:** For each iteration of the execution loop, Evo starts by making an informed prediction about what the best-next-step should be.
2. **Select Best Agent:** Based on this prediction, Evo selects a best-fit agent persona.
3. **Contextualize Chat History:** Based on the prediction from step 1, and the agent persona in step 2, the complete chat history is "contextualized" and only the most relevant messages are used for the final evaluation step.
4. **Evaluate and Execute:** A final evaluation step is run to determine what agent function is executed to try and further achieve the user's goal.

