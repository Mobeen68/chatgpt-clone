import "./chat.css";
import NewPrompt from "../../components/newPrompt/NewPrompt";

const Chat = () => {
  return (
    <div className="chatPage">
      <div className="wrapper">
        <div className="chat">
          <div className="message">Test message from ai</div>
          <div className="message user">
            Test message from user Lorem ipsum dolor sit amet consectetur
            adipisicing elit. Voluptates in doloremque, neque repellat aut rem
            tempora nam praesentium cumque ex quo laborum, omnis enim dolores
            harum ipsam quasi nihil. Necessitatibus?
          </div>
          <div className="message">Test message from ai</div>
          <div className="message user">Test message from user</div>
          <div className="message">Test message from ai</div>
          <div className="message user">Test message from user</div>
          <div className="message">Test message from ai</div>
          <div className="message user">Test message from user</div>
          <div className="message">Test message from ai</div>
          <div className="message user">Test message from user</div>
          <div className="message">Test message from ai</div>
          <div className="message user">Test message from user</div>
          <NewPrompt />
        </div>
      </div>
    </div>
  );
};

export default Chat;
