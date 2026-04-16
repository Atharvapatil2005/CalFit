import React, { useState, useRef, useEffect } from 'react';
import { View, ScrollView, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { Text, TextInput, IconButton, Surface, useTheme } from 'react-native-paper';
import { sendMessage } from '../../src/services/aiService';

type Message = {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  error?: boolean;
};

export default function ChatScreen() {
  const theme = useTheme();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your AI nutrition assistant. How can I help you today?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const requestInFlightRef = useRef(false);
  const lastFailedMessageRef = useRef('');

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  };

  const handleSend = async () => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage || isLoading || requestInFlightRef.current) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: trimmedMessage,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);
    requestInFlightRef.current = true;

    try {
      const aiResponse = await sendMessage([
        { role: 'user', content: trimmedMessage },
      ]);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      lastFailedMessageRef.current = '';
    } catch (error) {
      const errorText =
        error instanceof Error
          ? error.message
          : 'I’m having trouble connecting to the AI service right now.';

      if (lastFailedMessageRef.current === trimmedMessage) {
        return;
      }

      lastFailedMessageRef.current = trimmedMessage;

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: errorText,
        isUser: false,
        timestamp: new Date(),
        error: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      requestInFlightRef.current = false;
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100}
    >
      <ScrollView 
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
      >
        {messages.map((msg) => (
          <Surface
            key={msg.id}
            style={[
              styles.messageBubble,
              msg.isUser ? styles.userMessage : styles.aiMessage,
              { 
                backgroundColor: msg.error 
                  ? theme.colors.errorContainer 
                  : msg.isUser 
                    ? theme.colors.primary 
                    : theme.colors.surfaceVariant 
              },
            ]}
          >
            <Text style={[
              styles.messageText,
              { 
                color: msg.error 
                  ? theme.colors.onErrorContainer 
                  : msg.isUser 
                    ? theme.colors.onPrimary 
                    : theme.colors.onSurfaceVariant 
              }
            ]}>
              {msg.text}
            </Text>
            <Text style={[
              styles.timestamp,
              { 
                color: msg.error 
                  ? theme.colors.onErrorContainer 
                  : msg.isUser 
                    ? theme.colors.onPrimary 
                    : theme.colors.onSurfaceVariant 
              }
            ]}>
              {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </Surface>
        ))}
        {isLoading && (
          <Surface style={[styles.messageBubble, styles.aiMessage, { backgroundColor: theme.colors.surfaceVariant }]}>
            <ActivityIndicator color={theme.colors.primary} />
          </Surface>
        )}
      </ScrollView>

      <View style={[styles.inputContainer, { borderTopColor: theme.colors.outline }]}>
        <TextInput
          mode="outlined"
          value={message}
          onChangeText={setMessage}
          placeholder="Ask me anything about nutrition..."
          style={styles.input}
          right={
            <TextInput.Icon
              icon="send"
              onPress={handleSend}
              disabled={!message.trim() || isLoading}
            />
          }
          disabled={isLoading}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 16,
    marginBottom: 8,
    maxWidth: '80%',
  },
  userMessage: {
    alignSelf: 'flex-end',
  },
  aiMessage: {
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 16,
  },
  timestamp: {
    fontSize: 12,
    opacity: 0.7,
    marginTop: 4,
  },
  inputContainer: {
    padding: 16,
    borderTopWidth: 1,
  },
  input: {
    backgroundColor: 'transparent',
  },
}); 
