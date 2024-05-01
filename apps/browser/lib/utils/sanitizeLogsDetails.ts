import { ChatLog } from "@/components/Chat";

export type MessageSet = {
  userMessage: string;
  evoMessage?: string;
  details: Record<string, string[]>;
};

export function sanitizeLogs(messages: ChatLog[]): MessageSet[] {
  if (!messages || !messages.length) return [];

  // First, sort the messages by their creation date
  messages.sort(
    (a, b) =>
      new Date(a.created_at as string).getTime() -
      new Date(b.created_at as string).getTime()
  );

  return messages.reduce<MessageSet[]>((sanitizedLogs, currentMessage) => {
    const sanitizedLogsLength = sanitizedLogs.length;
    const currentSet =
      sanitizedLogsLength > 0 ? sanitizedLogs[sanitizedLogsLength - 1] : null;

    // If the message is from user, it means its the start of a new set of messages
    if (currentMessage.user === "user") {
      sanitizedLogs.push({
        userMessage: currentMessage.title,
        details: {},
        evoMessage: undefined,
      });
      return sanitizedLogs;
    }

    // If there's no initialized set, don't try to fill details
    if (!currentSet) {
      return sanitizedLogs;
    }
   // If there's no initialized set or title is not a string, don't try to fill details
   if (!currentSet || typeof currentMessage.title !== 'string') {
    return sanitizedLogs;
  }

  // Handle cases where title might be an empty object represented as "{}"
  if (currentMessage.title === "{}") {
    currentSet.evoMessage = "An error has happened, please contact support if this continue happening";
    return sanitizedLogs;
  }

  // Check and process titles based on their prefixes
  if (!currentMessage.title.startsWith("#")) {
    currentSet.evoMessage = currentMessage.title;
  } else {
    // Steps or onGoal{Status} are the ones that start with two #
    if (currentMessage.title.startsWith("## ")) {
      currentSet.details[currentMessage.title] = [];
    } else {
      // Get the title and/or content and attach to section
      const detailKeys = Object.keys(currentSet.details);
      const currentKey = detailKeys[detailKeys.length - 1];
      const detailContent = currentMessage.content
        ? currentMessage.title.concat(`\n${currentMessage.content}`)
        : currentMessage.title;
      const currentStep = currentSet.details[currentKey];
      // Ensure that current step exists before adding content to it
      if (currentStep) {
        currentStep.push(detailContent);
      }
    }
  }
  return sanitizedLogs;
}, []);
}