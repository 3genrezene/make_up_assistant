export default async (request, context) => {
  // Sadece POST isteklerine izin ver
  if (request.method !== "POST") {
    return new Response("Yalnızca POST istekleri desteklenir", { status: 405 });
  }

  // Netlify panelindeki güvenli API anahtarını alıyoruz
  const apiKey = Netlify.env.get("GEMINI_API_KEY");
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "API anahtarı sunucuda eksik!" }), { status: 500 });
  }

  try {
    const body = await request.json();
    
    // İsteği doğrudan Google API'sine güvenli sunucumuz üzerinden iletiyoruz
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};