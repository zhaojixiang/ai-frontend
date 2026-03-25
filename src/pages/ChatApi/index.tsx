import { useEffect, useState } from 'react';

export default function ChatApi() {
  const [text, setText] = useState('');

  useEffect(() => {
    async function chat() {
      async function callDeepSeek() {
        const API_KEY = 'sk-3b28a08f3cee42e290054948322a6304'; // ⚠️ 警告：仅用于本地测试！
        const API_URL = 'https://api.deepseek.com/chat/completions';

        try {
          const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${API_KEY}` // 安全风险点
            },
            body: JSON.stringify({
              model: 'deepseek-chat',
              messages: [
                { role: 'system', content: 'You are a helpful assistant.' },
                { role: 'user', content: '你好，请介绍一下你自己。' }
              ],
              stream: true
            })
          });

          const reader = response.body.getReader();
          const decoder = new TextDecoder();

          let result = '';

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);

            const lines = chunk.split('\n');

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.replace('data: ', '');

                if (data === '[DONE]') return;

                const json = JSON.parse(data);

                const content = json.choices?.[0]?.delta?.content;

                if (content) {
                  result += content;
                  setText(result);
                }
              }
            }
          }
        } catch (error) {
          console.error('Error:', error);
          // document.getElementById('response-area').innerText = '请求失败: ' + error.message;
        }
      }

      // 调用函数
      callDeepSeek();
    }

    chat();
  }, []);
  return (
    <div>
      <h1>🍉 Fruit 1</h1>
      <p>{text}</p>
    </div>
  );
}
