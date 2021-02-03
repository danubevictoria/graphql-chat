import { useQuery, useMutation, useSubscription } from "@apollo/react-hooks";
import React, { useState } from "react";
import {
  addMessageMutation,
  messageAddedSubscription,
  messagesQuery,
} from "./graphql/queries";
import MessageInput from "./MessageInput";
import MessageList from "./MessageList";

const Chat = ({ user }) => {
  // component will be rendered twice when the data is available
  // const result = useQuery(messagesQuery);

  // this is what useQuery does
  // const [result, setResult] = useState({loading: true});
  // client.query({query: messagesQuery}).then(({data}) => setResult({loading: false, data}))

  // Typically use loading and error that comes back from useQuery to render states for the user
  // const { loading, error, data } = useQuery(messagesQuery);
  const [messages, setMessages] = useState([]);
  useQuery(messagesQuery, {
    onCompleted: ({ messages }) => setMessages(messages),
  });
  useSubscription(messageAddedSubscription, {
    onSubscriptionData: ({ subscriptionData }) => {
      setMessages(messages.concat(subscriptionData.data.messageAdded));
    },
  });

  // Returns a function that lets us trigger mutation function later
  // Can also return a second result { loading, error, data, called } if interested in rendering different states based on mutation state
  const [addMessage] = useMutation(addMessageMutation);
  // const messages = data ? data.messages : [];

  const handleSend = async (text) => {
    await addMessage({ variables: { input: { text } } });
  };

  // Handle loading and error states to user
  // if (loading) return <Spinner />;
  // if (error) return <div>Error!</div>;

  return (
    <section className="section">
      <div className="container">
        <h1 className="title">Chatting as {user}</h1>
        <MessageList user={user} messages={messages} />
        <MessageInput onSend={handleSend} />
      </div>
    </section>
  );
};

export default Chat;
