import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

export const AIState = model.startChat({
  generationConfig,
  history: [
    {
      role: "user",
      parts: [
        {
          text: `give me list of cities in given state:maharashtra,country:india.include cities,short description,history,famous for. in json formate`,
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text: `\`\`\`json
[
  {
    "city": "Mumbai",
    "description": "The financial capital of India, a bustling metropolis on the coast.",
    "history": "Originally a group of seven islands inhabited by fishing communities. It was controlled by various empires before being ceded to the Portuguese and later to the British East India Company. It grew significantly during the British Raj as a major trading port.",
    "famous_for": "Bollywood (Indian film industry), Gateway of India, street food, nightlife, business and finance, Elephanta Caves."
  },
  {
    "city": "Pune",
    "description": "A major educational and IT hub, known for its rich cultural heritage and historical significance.",
    "history": "Historically important as the seat of the Maratha Empire. Played a crucial role in Indian independence movements and has since grown into a major industrial and educational center.",
    "famous_for": "Education, IT industry, historical forts (like Shaniwar Wada), temples (like Dagdusheth Halwai Ganpati), Osho International Meditation Resort, Aga Khan Palace."
  },
  {
    "city": "Nagpur",
    "description": "Known as the 'Orange City' due to its abundant orange orchards, a major commercial and political center.",
    "history": "Founded by the Gond King Bakht Buland Shah in the early 18th century. It later became the capital of the Nagpur Kingdom under the Bhonsle dynasty before coming under British rule.",
    "famous_for": "Oranges, Deekshabhoomi (a significant Buddhist monument), Zero Mile Stone (center of India), tiger reserves (near Nagpur)."
  },
  {
    "city": "Nashik",
    "description": "A major Hindu pilgrimage site, known for its temples and vineyards.",
    "history": "Mentioned in the Ramayana, it has a long and rich history. It was ruled by various dynasties, including the Satavahanas and the Mughals. It is one of the four cities where the Kumbh Mela is held.",
    "famous_for": "Kumbh Mela, temples (Trimbakeshwar, Kalaram Temple), vineyards, grape cultivation, wine production, hills."
  },
  {
    "city": "Aurangabad",
    "description": "A historical city with significant Mughal architecture, including the famous Ajanta and Ellora Caves located nearby.",
    "history": "Founded by Malik Ambar, the Prime Minister of the Nizamshahi dynasty of Ahmednagar. It later became a significant Mughal city under Aurangzeb.",
    "famous_for": "Ajanta and Ellora Caves (UNESCO World Heritage Sites), Bibi Ka Maqbara (a mausoleum resembling the Taj Mahal), Daulatabad Fort."
  },
  {
    "city": "Solapur",
    "description": "Known for its textile industry and historical temples.",
    "history": "Ruled by various dynasties, including the Chalukyas, Rashtrakutas, and Yadavas. It was also a major center during the Indian independence movement.",
    "famous_for": "Textiles (particularly Solapuri chaddars), temples (Siddheshwar Temple), the Great Indian Bustard Sanctuary nearby."
  },
   {
    "city": "Kolhapur",
    "description": "Known for its rich cultural heritage, wrestling, and the Mahalakshmi Temple.",
    "history": "Part of various empires like the Mauryas, Satavahanas, and Chalukyas. It was also the seat of the princely state of Kolhapur during British rule.",
    "famous_for": "Mahalakshmi Temple, Kolhapuri chappals (leather sandals), Kolhapuri cuisine (spicy), wrestling."
  },
   {
    "city": "Amravati",
    "description": "A major educational and commercial center in the Vidarbha region of Maharashtra.",
    "history": "Historically a part of the Berar province, it has been ruled by various dynasties. It's a significant agricultural hub and a growing urban center.",
    "famous_for": "Ambadevi Temple, Shri Shivaji College, commercial hub for the surrounding agricultural region."
  },
  {
   "city": "Sangli",
   "description": "Known as the 'Sugar City of Maharashtra' due to its large number of sugar factories.",
   "history": "Part of the Maratha Empire and later ruled by the Patwardhan dynasty. The city is a prominent trade center for agricultural produce.",
   "famous_for": "Sugar production, turmeric trade, Ganpati Temple, historical forts in the surrounding area."
  },
  {
    "city": "Akola",
    "description": "A major city in the Vidarbha region, known for its cotton production and agriculture.",
    "history": "Historically important as a trading center and a part of the Berar province. It's a significant agricultural processing hub.",
    "famous_for": "Cotton production, Raj Rajeshwar Temple, agricultural trade."
  }
]
\`\`\``,
        },
      ],
    },
    {
      role: "user",
      parts: [
        {
          text: `INSERT_INPUT_HERE`,
        },
      ],
    },
  ],
});
