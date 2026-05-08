// utils/clientTranslator.ts

export async function translateText(text: string, targetLang: string): Promise<string> {
  if (!text || targetLang === 'en') return text;

  try {
    // Using a reliable Google Translate public web API mirror
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
    
    const res = await fetch(url);
    if (!res.ok) throw new Error("Translation request failed");
    
    const data = await res.json();
    
    // Google Translate returns an array of sentence fragments. We stitch them back together.
    const translatedParagraph = data[0]
      .map((item: any) => item[0])
      .join("");
      
    return translatedParagraph;
  } catch (error) {
    console.error("Alternative Translation failed, returning raw text:", error);
    return text;
  }
}