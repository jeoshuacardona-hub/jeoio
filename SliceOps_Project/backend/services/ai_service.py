from core.config import settings
try:
    import openai
except ImportError:
    openai = None

class AIService:
    def __init__(self):
        self.api_key = settings.OPENAI_API_KEY
        if openai and self.api_key:
            openai.api_key = self.api_key

    async def generate_response(self, prompt: str, context: str = "") -> str:
        if not openai or not self.api_key:
            return f"[AI Mock] No OpenAI key or library found. Responding to: {prompt}"

        try:
            response = await openai.ChatCompletion.acreate(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are a helpful assistant for Stitch Pizza."},
                    {"role": "user", "content": f"Context: {context}\nUser: {prompt}"}
                ]
            )
            return response.choices[0].message.content
        except Exception as e:
            print(f"Error generating AI response: {e}")
            return "Lo siento, tuve un problema procesando tu mensaje."

ai_service = AIService()
