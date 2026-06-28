const GREETINGS = ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'greetings'];

export function handleUserMessage(userMessage: string): { text: string; isGreet: boolean } {
    if (!userMessage) return { text: '', isGreet: false };

    const cleanMessage = userMessage.trim().toLowerCase();
    const isPureGreeting = GREETINGS.some(greeting => cleanMessage === greeting || cleanMessage === `${greeting}!`);
    
    if (isPureGreeting) {
        return {
            text: "Hello! How can I help you today?",
            isGreet: true
        };
    }

    for (const greeting of GREETINGS) {
        const greetingRegex = new RegExp(`^${greeting}\\b[,.!\\s]*`, 'i');
        
        if (greetingRegex.test(userMessage)) {
            const remainingText = userMessage.replace(greetingRegex, '').trim();

            if (remainingText.length > 0) {
                return {
                    text: remainingText,
                    isGreet: false
                };
            }
        }
    }

    return {
        text: userMessage,
        isGreet: false
    };
}