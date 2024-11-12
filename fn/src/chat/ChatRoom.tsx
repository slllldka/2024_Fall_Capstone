import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
}

export default function ChatRoom(): React.ReactElement {
  const navigation = useNavigation();
  const [messages, setMessages] = useState<Message[]>([
    {id: '1', text: "How's your project going?", sender: 'ai'},
    {id: '2', text: 'Hi Brooke!', sender: 'user'},
    {id: '3', text: "It's going well. Thanks for asking!", sender: 'user'},
    {id: '4', text: 'No worries. Let me know if you need any help 😊', sender: 'ai'},
    {id: '5', text: "You're the best!", sender: 'user'},
  ]);
  const [inputText, setInputText] = useState('');

  const handleSend = () => {
    if (inputText.trim() !== '') {
      const newMessage: Message = {
        id: `${messages.length + 1}`,
        text: inputText,
        sender: 'user',
      };
      setMessages([...messages, newMessage]);
      setInputText('');
      // Simulate AI response (This would usually come from the server)
      setTimeout(() => {
        const aiMessage: Message = {
          id: `${messages.length + 2}`,
          text: 'This is an AI response to your message.',
          sender: 'ai',
        };
        setMessages(prevMessages => [...prevMessages, aiMessage]);
      }, 1000);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior='padding'>
      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <View
            style={[
              styles.messageContainer,
              item.sender === 'user' ? styles.userMessage : styles.aiMessage,
            ]}
          >
            <Text style={item.sender === 'user' ? styles.userText : styles.aiText}>
              {item.text}
            </Text>
          </View>
        )}
        contentContainerStyle={{paddingBottom: 20}}
        inverted
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={inputText}
          onChangeText={setInputText}
          placeholder='Type a message...'
          placeholderTextColor='#888'
        />
        <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
          <Text style={styles.sendButtonText}>send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e1e',
    paddingTop: 20,
  },
  messageContainer: {
    maxWidth: '80%',
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
    marginHorizontal: 10,
  },
  userMessage: {
    backgroundColor: '#007AFF',
    alignSelf: 'flex-end',
  },
  aiMessage: {
    backgroundColor: '#f2f2f2',
    alignSelf: 'flex-start',
  },
  userText: {
    color: '#ffffff',
    fontWeight: '500',
  },
  aiText: {
    color: '#000000',
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 30,
    // backgroundColor: '#333',
  },
  textInput: {
    flex: 1,
    height: 40,
    backgroundColor: '#2e2e2e',
    color: '#ffffff',
    borderRadius: 20,
    paddingHorizontal: 15,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
