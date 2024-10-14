import "./chat.css";
import NewPrompt from "../../components/newPrompt/NewPrompt";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import Markdown from "react-markdown";
import { IKImage } from "imagekitio-react";

const Chat = () => {
  const path = useLocation().pathname;
  const chatId = path.split("/").pop();

  const { isPending, error, data } = useQuery({
    queryKey: ["chat", chatId],
    queryFn: () =>
      fetch(`${import.meta.env.VITE_BASE_URL}/api/chats/${chatId}`, {
        credentials: "include",
      }).then((res) => res.json()),
  });

  return (
    <div className="chatPage">
      <div className="wrapper">
        <div className="chat">
          {isPending
            ? "Loading..."
            : error
            ? error
            : data?.history?.map((msg) => (
                <>
                  {msg.img && (
                    <IKImage
                      urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
                      path={msg.img}
                      height={300}
                      width={400}
                      transformation={[
                        {
                          height: 300,
                          width: 400,
                        },
                      ]}
                      loading="lazy"
                      lqip={{
                        active: true,
                        quality: 20,
                      }}
                    />
                  )}
                  <div
                    className={msg.role === "user" ? "message user" : "message"}
                    key={msg._id}
                  >
                    <Markdown>{msg.parts[0]?.text}</Markdown>
                  </div>
                </>
              ))}

          {data && <NewPrompt data={data} />}
        </div>
      </div>
    </div>
  );
};

export default Chat;
