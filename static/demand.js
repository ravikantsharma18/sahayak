const $ = (id) => document.getElementById(id);
let language = localStorage.getItem('sahayak-language') || 'en';

const copy = {
  en: { feed: 'DEMAND INTELLIGENCE', localHistory: 'Local buyer history', priceAware: 'Price-aware forecasts', localData: 'Delhi + Patna data', priceForecast: 'Price forecast', demandForecast: 'Demand forecast', headingEyebrow: 'BUYER DEMAND · NEXT MARKET DAY', heading: "Plan tomorrow's demand", intro: 'Choose a commodity and mandi. The model learns from previous quantities, prices, weekdays, and your saved purchases.', controlsEyebrow: 'FORECAST CONTROLS', segmentTitle: 'Demand by segment', commodity: 'Commodity', mandi: 'Mandi', nextPrice: 'Price for next day (optional)', forecastButton: 'Forecast demand now', nextDemand: 'Next-day demand', kilograms: 'kilograms', historyUsed: 'History used', daysSegment: 'days in segment', forecastPrice: 'Forecast price', perKilogram: 'per kilogram', forwardView: 'FORWARD VIEW', outlook: 'Demand outlook', date: 'Date', expectedDemand: 'Expected demand', priceUsed: 'Price used', purchasesEyebrow: 'YOUR PURCHASES', addBuyer: 'Add buyer data', purchaseHelp: 'Saved entries are included in the next forecast for the same commodity and mandi.', quantity: 'Quantity (kg)', pricePerKg: 'Price per kg (INR)', totalAmount: 'Total amount (INR)', savePurchase: 'Save purchase', disclaimer: 'Demand forecasts are directional estimates. Add actual purchases to make the selected segment more representative over time.', loading: 'Loading demand history...', learning: 'Learning from historical and saved purchases...', ready: 'forecast ready', saved: 'Purchase saved and included in future forecasts.', saving: 'Saving purchase...', error: 'Demand forecast could not be calculated.', autoAmount: 'Auto-calculated' },
  hi: { feed: 'मांग जानकारी', localHistory: 'स्थानीय खरीदार इतिहास', priceAware: 'कीमत आधारित अनुमान', localData: 'दिल्ली + पटना डेटा', priceForecast: 'भाव अनुमान', demandForecast: 'मांग अनुमान', headingEyebrow: 'खरीदार मांग · अगला बाजार दिन', heading: 'कल की मांग की योजना बनाएं', intro: 'फसल और मंडी चुनें। मॉडल पिछली मात्रा, कीमत, सप्ताह के दिन और आपकी खरीद से सीखता है।', controlsEyebrow: 'अनुमान नियंत्रण', segmentTitle: 'खंड के अनुसार मांग', commodity: 'फसल', mandi: 'मंडी', nextPrice: 'अगले दिन की कीमत (वैकल्पिक)', forecastButton: 'मांग का अनुमान', nextDemand: 'अगले दिन की मांग', kilograms: 'किलोग्राम', historyUsed: 'उपयोग किया गया इतिहास', daysSegment: 'खंड के दिन', forecastPrice: 'अनुमानित कीमत', perKilogram: 'प्रति किलोग्राम', forwardView: 'आगे का दृश्य', outlook: 'मांग अनुमान', date: 'तारीख', expectedDemand: 'अनुमानित मांग', priceUsed: 'उपयोग की गई कीमत', purchasesEyebrow: 'आपकी खरीद', addBuyer: 'खरीद डेटा जोड़ें', purchaseHelp: 'उसी फसल और मंडी के अगले अनुमान में आपकी सहेजी खरीद शामिल होगी।', quantity: 'मात्रा (किलो)', pricePerKg: 'प्रति किलो कीमत (INR)', totalAmount: 'कुल राशि (INR)', savePurchase: 'खरीद सहेजें', disclaimer: 'मांग अनुमान दिशात्मक हैं। चयनित खंड को बेहतर बनाने के लिए वास्तविक खरीद जोड़ें।', loading: 'मांग इतिहास लोड हो रहा है...', learning: 'इतिहास और सहेजी खरीद से सीख रहा है...', ready: 'अनुमान तैयार', saved: 'खरीद सहेज दी गई और अगले अनुमान में शामिल है।', saving: 'खरीद सहेजी जा रही है...', error: 'मांग अनुमान नहीं निकाला जा सका।', autoAmount: 'स्वचालित गणना' },
  mr: { feed: 'मागणी माहिती', localHistory: 'स्थानिक खरेदीदार इतिहास', priceAware: 'किमतीवर आधारित अंदाज', localData: 'दिल्ली + पाटणा डेटा', priceForecast: 'भावाचा अंदाज', demandForecast: 'मागणीचा अंदाज', headingEyebrow: 'खरेदीदार मागणी · पुढील बाजार दिवस', heading: 'उद्याच्या मागणीचे नियोजन करा', intro: 'पीक आणि मंडी निवडा. मॉडेल मागील प्रमाण, किंमत, वार आणि तुमच्या खरेदीतून शिकते.', controlsEyebrow: 'अंदाज नियंत्रण', segmentTitle: 'विभागानुसार मागणी', commodity: 'पीक', mandi: 'मंडी', nextPrice: 'पुढील दिवसाची किंमत (ऐच्छिक)', forecastButton: 'मागणीचा अंदाज', nextDemand: 'उद्याची मागणी', kilograms: 'किलोग्रॅम', historyUsed: 'वापरलेला इतिहास', daysSegment: 'विभागातील दिवस', forecastPrice: 'अंदाजित किंमत', perKilogram: 'प्रति किलोग्रॅम', forwardView: 'पुढील दृश्य', outlook: 'मागणी अंदाज', date: 'तारीख', expectedDemand: 'अपेक्षित मागणी', priceUsed: 'वापरलेली किंमत', purchasesEyebrow: 'तुमच्या खरेदी', addBuyer: 'खरेदी डेटा जोडा', purchaseHelp: 'त्याच पिकासाठी आणि मंडीसाठी पुढील अंदाजात तुमच्या खरेदीचा समावेश होईल.', quantity: 'प्रमाण (किलो)', pricePerKg: 'प्रति किलो किंमत (INR)', totalAmount: 'एकूण रक्कम (INR)', savePurchase: 'खरेदी जतन करा', disclaimer: 'मागणीचे अंदाज दिशादर्शक आहेत. विभाग अधिक अचूक करण्यासाठी खरेदी जोडा.', loading: 'मागणी इतिहास लोड होत आहे...', learning: 'इतिहास आणि जतन केलेल्या खरेदीतून शिकत आहे...', ready: 'अंदाज तयार', saved: 'खरेदी जतन झाली आणि पुढील अंदाजात समाविष्ट आहे.', saving: 'खरेदी जतन होत आहे...', error: 'मागणीचा अंदाज काढता आला नाही.', autoAmount: 'स्वयंचलित गणना' },
  ta: { feed: 'தேவை தகவல்', localHistory: 'உள்ளூர் வாங்குபவர் வரலாறு', priceAware: 'விலை அடிப்படையிலான கணிப்பு', localData: 'டெல்லி + பாட்னா தரவு', priceForecast: 'விலை கணிப்பு', demandForecast: 'தேவை கணிப்பு', headingEyebrow: 'வாங்குபவர் தேவை · அடுத்த சந்தை நாள்', heading: 'நாளைய தேவையைத் திட்டமிடுங்கள்', intro: 'பயிரையும் மண்டியையும் தேர்வு செய்யுங்கள். முந்தைய அளவு, விலை, வார நாள் மற்றும் உங்கள் கொள்முதலிலிருந்து மாடல் கற்கும்.', controlsEyebrow: 'கணிப்பு கட்டுப்பாடுகள்', segmentTitle: 'பிரிவு வாரியான தேவை', commodity: 'பயிர்', mandi: 'மண்டி', nextPrice: 'அடுத்த நாள் விலை (விருப்பம்)', forecastButton: 'தேவையை கணிக்கவும்', nextDemand: 'அடுத்த நாள் தேவை', kilograms: 'கிலோகிராம்', historyUsed: 'பயன்படுத்திய வரலாறு', daysSegment: 'பிரிவின் நாட்கள்', forecastPrice: 'கணிக்கப்பட்ட விலை', perKilogram: 'கிலோகிராமுக்கு', forwardView: 'முன்னோக்கு', outlook: 'தேவை கணிப்பு', date: 'தேதி', expectedDemand: 'எதிர்பார்க்கப்படும் தேவை', priceUsed: 'பயன்படுத்திய விலை', purchasesEyebrow: 'உங்கள் கொள்முதல்கள்', addBuyer: 'வாங்குபவர் தரவைச் சேர்க்கவும்', purchaseHelp: 'அதே பயிர் மற்றும் மண்டிக்கான அடுத்த கணிப்பில் சேமித்த கொள்முதல்கள் சேர்க்கப்படும்.', quantity: 'அளவு (கிலோ)', pricePerKg: 'கிலோ விலை (INR)', totalAmount: 'மொத்த தொகை (INR)', savePurchase: 'கொள்முதலை சேமிக்கவும்', disclaimer: 'தேவை கணிப்புகள் வழிகாட்டுதலுக்கானவை. பிரிவை மேம்படுத்த உண்மையான கொள்முதல்களைச் சேர்க்கவும்.', loading: 'தேவை வரலாறு ஏற்றப்படுகிறது...', learning: 'வரலாறு மற்றும் சேமித்த கொள்முதலிலிருந்து கற்கிறது...', ready: 'கணிப்பு தயார்', saved: 'கொள்முதல் சேமிக்கப்பட்டு அடுத்த கணிப்பில் சேர்க்கப்பட்டது.', saving: 'கொள்முதல் சேமிக்கப்படுகிறது...', error: 'தேவை கணிப்பை கணக்கிட முடியவில்லை.', autoAmount: 'தானியங்கி கணக்கீடு' },
  gu: { feed: 'માંગ માહિતી', localHistory: 'સ્થાનિક ખરીદદાર ઇતિહાસ', priceAware: 'ભાવ આધારિત આગાહી', localData: 'દિલ્હી + પટના ડેટા', priceForecast: 'ભાવની આગાહી', demandForecast: 'માંગની આગાહી', headingEyebrow: 'ખરીદદાર માંગ · આગામી બજાર દિવસ', heading: 'આવતીકાલની માંગનું આયોજન કરો', intro: 'પાક અને મંડી પસંદ કરો. મોડેલ અગાઉની માત્રા, ભાવ, વાર અને તમારી ખરીદીમાંથી શીખે છે.', controlsEyebrow: 'આગાહી નિયંત્રણો', segmentTitle: 'વિભાગ પ્રમાણે માંગ', commodity: 'પાક', mandi: 'મંડી', nextPrice: 'આવતા દિવસનો ભાવ (વૈકલ્પિક)', forecastButton: 'માંગની આગાહી', nextDemand: 'આવતીકાલની માંગ', kilograms: 'કિલોગ્રામ', historyUsed: 'વપરાયેલ ઇતિહાસ', daysSegment: 'વિભાગના દિવસો', forecastPrice: 'અનુમાનિત ભાવ', perKilogram: 'કિલોગ્રામ દીઠ', forwardView: 'આગળનું દૃશ્ય', outlook: 'માંગ આગાહી', date: 'તારીખ', expectedDemand: 'અપેક્ષિત માંગ', priceUsed: 'વપરાયેલ ભાવ', purchasesEyebrow: 'તમારી ખરીદી', addBuyer: 'ખરીદી ડેટા ઉમેરો', purchaseHelp: 'આ જ પાક અને મંડીની આગામી આગાહીમાં તમારી સાચવેલી ખરીદી સામેલ થશે.', quantity: 'માત્રા (કિલો)', pricePerKg: 'કિલો દીઠ ભાવ (INR)', totalAmount: 'કુલ રકમ (INR)', savePurchase: 'ખરીદી સાચવો', disclaimer: 'માંગની આગાહીઓ માર્ગદર્શક છે. વિભાગને વધુ સારું બનાવવા વાસ્તવિક ખરીદી ઉમેરો.', loading: 'માંગ ઇતિહાસ લોડ થઈ રહ્યો છે...', learning: 'ઇતિહાસ અને સાચવેલી ખરીદીમાંથી શીખી રહ્યું છે...', ready: 'આગાહી તૈયાર', saved: 'ખરીદી સાચવાઈ અને આગામી આગાહીમાં ઉમેરાઈ.', saving: 'ખરીદી સાચવાઈ રહી છે...', error: 'માંગની આગાહી થઈ શકી નથી.', autoAmount: 'આપમેળે ગણતરી' },
  bn: { feed: 'চাহিদা তথ্য', localHistory: 'স্থানীয় ক্রেতার ইতিহাস', priceAware: 'দামভিত্তিক পূর্বাভাস', localData: 'দিল্লি + পাটনা ডেটা', priceForecast: 'দামের পূর্বাভাস', demandForecast: 'চাহিদার পূর্বাভাস', headingEyebrow: 'ক্রেতার চাহিদা · পরের বাজার দিন', heading: 'আগামীর চাহিদা পরিকল্পনা করুন', intro: 'ফসল ও মন্ডি বেছে নিন। মডেল আগের পরিমাণ, দাম, সপ্তাহের দিন এবং আপনার কেনাকাটা থেকে শেখে।', controlsEyebrow: 'পূর্বাভাস নিয়ন্ত্রণ', segmentTitle: 'বিভাগ অনুযায়ী চাহিদা', commodity: 'ফসল', mandi: 'মন্ডি', nextPrice: 'পরের দিনের দাম (ঐচ্ছিক)', forecastButton: 'চাহিদার পূর্বাভাস', nextDemand: 'পরের দিনের চাহিদা', kilograms: 'কিলোগ্রাম', historyUsed: 'ব্যবহৃত ইতিহাস', daysSegment: 'বিভাগের দিন', forecastPrice: 'পূর্বাভাসিত দাম', perKilogram: 'প্রতি কিলোগ্রাম', forwardView: 'আগাম দৃশ্য', outlook: 'চাহিদার পূর্বাভাস', date: 'তারিখ', expectedDemand: 'প্রত্যাশিত চাহিদা', priceUsed: 'ব্যবহৃত দাম', purchasesEyebrow: 'আপনার কেনাকাটা', addBuyer: 'ক্রয় ডেটা যোগ করুন', purchaseHelp: 'একই ফসল ও মন্ডির পরের পূর্বাভাসে আপনার সংরক্ষিত কেনাকাটা যুক্ত হবে।', quantity: 'পরিমাণ (কেজি)', pricePerKg: 'প্রতি কেজি দাম (INR)', totalAmount: 'মোট পরিমাণ (INR)', savePurchase: 'কেনাকাটা সংরক্ষণ করুন', disclaimer: 'চাহিদার পূর্বাভাস দিকনির্দেশমূলক। বিভাগ উন্নত করতে বাস্তব কেনাকাটা যোগ করুন।', loading: 'চাহিদার ইতিহাস লোড হচ্ছে...', learning: 'ইতিহাস ও সংরক্ষিত কেনাকাটা থেকে শেখা হচ্ছে...', ready: 'পূর্বাভাস প্রস্তুত', saved: 'কেনাকাটা সংরক্ষিত এবং পরের পূর্বাভাসে যুক্ত হয়েছে।', saving: 'কেনাকাটা সংরক্ষণ হচ্ছে...', error: 'চাহিদার পূর্বাভাস গণনা করা যায়নি।', autoAmount: 'স্বয়ংক্রিয় হিসাব' },
  te: { feed: 'డిమాండ్ సమాచారం', localHistory: 'స్థానిక కొనుగోలుదారుల చరిత్ర', priceAware: 'ధర ఆధారిత అంచనా', localData: 'ఢిల్లీ + పాట్నా డేటా', priceForecast: 'ధర అంచనా', demandForecast: 'డిమాండ్ అంచనా', headingEyebrow: 'కొనుగోలుదారుల డిమాండ్ · తదుపరి మార్కెట్ రోజు', heading: 'రేపటి డిమాండ్‌ను ప్లాన్ చేయండి', intro: 'పంట మరియు మండిని ఎంచుకోండి. మోడల్ గత పరిమాణాలు, ధరలు, వారపు రోజులు మరియు మీ కొనుగోళ్ల నుంచి నేర్చుకుంటుంది.', controlsEyebrow: 'అంచనా నియంత్రణలు', segmentTitle: 'విభాగం వారీ డిమాండ్', commodity: 'పంట', mandi: 'మండి', nextPrice: 'తదుపరి రోజు ధర (ఐచ్ఛికం)', forecastButton: 'డిమాండ్ అంచనా', nextDemand: 'రేపటి డిమాండ్', kilograms: 'కిలోగ్రాములు', historyUsed: 'ఉపయోగించిన చరిత్ర', daysSegment: 'విభాగంలోని రోజులు', forecastPrice: 'అంచనా ధర', perKilogram: 'కిలోగ్రాముకు', forwardView: 'ముందస్తు దృశ్యం', outlook: 'డిమాండ్ అంచనా', date: 'తేదీ', expectedDemand: 'ఆశించిన డిమాండ్', priceUsed: 'ఉపయోగించిన ధర', purchasesEyebrow: 'మీ కొనుగోళ్లు', addBuyer: 'కొనుగోలు డేటా జోడించండి', purchaseHelp: 'అదే పంట మరియు మండికి తదుపరి అంచనాలో మీ సేవ్ చేసిన కొనుగోళ్లు చేర్చబడతాయి.', quantity: 'పరిమాణం (కిలోలు)', pricePerKg: 'కిలో ధర (INR)', totalAmount: 'మొత్తం (INR)', savePurchase: 'కొనుగోలు సేవ్ చేయండి', disclaimer: 'డిమాండ్ అంచనాలు మార్గదర్శకమైనవి. విభాగాన్ని మెరుగుపరచడానికి నిజమైన కొనుగోళ్లు జోడించండి.', loading: 'డిమాండ్ చరిత్ర లోడ్ అవుతోంది...', learning: 'చరిత్ర మరియు సేవ్ చేసిన కొనుగోళ్లతో నేర్చుకుంటోంది...', ready: 'అంచనా సిద్ధంగా ఉంది', saved: 'కొనుగోలు సేవ్ చేయబడింది మరియు తదుపరి అంచనాలో చేర్చబడింది.', saving: 'కొనుగోలు సేవ్ అవుతోంది...', error: 'డిమాండ్ అంచనా లెక్కించలేకపోయాము.', autoAmount: 'ఆటో లెక్కింపు' }
};

const optionTranslations = {
  hi: { Rice: 'चावल', Wheat: 'गेहूं', Onion: 'प्याज', Potato: 'आलू', Tomato: 'टमाटर', Apple: 'सेब', Banana: 'केला', Mango: 'आम', Guava: 'अमरूद', Fish: 'मछली', 'Green Chilli': 'हरी मिर्च' },
  mr: { Rice: 'तांदूळ', Wheat: 'गहू', Onion: 'कांदा', Potato: 'बटाटा', Tomato: 'टोमॅटो', Apple: 'सफरचंद', Banana: 'केळी', Mango: 'आंबा', Guava: 'पेरू', Fish: 'मासे', 'Green Chilli': 'हिरवी मिरची' },
  ta: { Rice: 'அரிசி', Wheat: 'கோதுமை', Onion: 'வெங்காயம்', Potato: 'உருளைக்கிழங்கு', Tomato: 'தக்காளி', Apple: 'ஆப்பிள்', Banana: 'வாழைப்பழம்', Mango: 'மாம்பழம்', Guava: 'கொய்யா', Fish: 'மீன்', 'Green Chilli': 'பச்சை மிளகாய்' },
  gu: { Rice: 'ચોખા', Wheat: 'ઘઉં', Onion: 'ડુંગળી', Potato: 'બટાકા', Tomato: 'ટામેટા', Apple: 'સફરજન', Banana: 'કેળા', Mango: 'કેરી', Guava: 'જામફળ', Fish: 'માછલી', 'Green Chilli': 'લીલા મરચાં' },
  bn: { Rice: 'চাল', Wheat: 'গম', Onion: 'পেঁয়াজ', Potato: 'আলু', Tomato: 'টমেটো', Apple: 'আপেল', Banana: 'কলা', Mango: 'আম', Guava: 'পেয়ারা', Fish: 'মাছ', 'Green Chilli': 'কাঁচা মরিচ' },
  te: { Rice: 'బియ్యం', Wheat: 'గోధుమ', Onion: 'ఉల్లిపాయ', Potato: 'బంగాళాదుంప', Tomato: 'టమాటా', Apple: 'ఆపిల్', Banana: 'అరటి', Mango: 'మామిడి', Guava: 'జామ', Fish: 'చేప', 'Green Chilli': 'పచ్చి మిరపకాయ' }
};

function optionLabel(value) { return optionTranslations[language]?.[value] || value; }

function money(value) {
  return `₹${Number(value).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
}

function applyLanguage() {
  const strings = copy[language];
  document.documentElement.lang = language === 'hi' ? 'hi' : 'en';
  document.querySelectorAll('[data-i18n]').forEach((element) => { element.textContent = strings[element.dataset.i18n]; });
  document.querySelectorAll('[data-language]').forEach((button) => button.classList.toggle('active', button.dataset.language === language));
  refreshDemandOptionLabels();
  $('demand-price').placeholder = strings.autoAmount === copy.en.autoAmount ? 'Use latest price' : strings.nextPrice;
}

function refreshDemandOptionLabels() {
  document.querySelectorAll('#demand-commodity option, #demand-mandi option').forEach((option) => {
    option.textContent = optionLabel(option.value);
  });
}

async function loadDemandOptions() {
  const data = await fetch('/api/demand/options').then((response) => response.json());
  $('demand-commodity').innerHTML = data.commodities.map((item) => `<option value="${item}">${optionLabel(item)}</option>`).join('');
  $('demand-mandi').innerHTML = data.mandis.map((item) => `<option value="${item}">${optionLabel(item)}</option>`).join('');
  $('commodity-list').innerHTML = data.commodities.map((item) => `<option value="${item}">${optionLabel(item)}</option>`).join('');
  $('mandi-list').innerHTML = data.mandis.map((item) => `<option value="${item}">`).join('');
  if (data.commodities.includes('Onion')) $('demand-commodity').value = 'Onion';
  if (data.mandis.includes('Azadpur')) $('demand-mandi').value = 'Azadpur';
  $('purchase-commodity').value = $('demand-commodity').value;
  $('purchase-mandi').value = $('demand-mandi').value;
  applyLanguage();
  await forecastDemand();
}

async function forecastDemand() {
  $('demand-run').disabled = true;
  $('demand-status').textContent = copy[language].learning;
  const params = new URLSearchParams({ commodity: $('demand-commodity').value, mandi: $('demand-mandi').value });
  if ($('demand-price').value) params.set('price', $('demand-price').value);
  try {
    const response = await fetch(`/api/demand/forecast?${params}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    $('demand-result').hidden = false;
    $('next-demand').textContent = `${data.forecast[0].quantity_kg.toLocaleString('en-IN')} kg`;
    $('history-days').textContent = data.history_days.toLocaleString('en-IN');
    $('forecast-price').textContent = money(data.forecast[0].price_per_kg);
    $('demand-rows').innerHTML = data.forecast.map((point) => `<tr><td>${point.date}</td><td>${point.quantity_kg.toLocaleString('en-IN')} kg</td><td>${money(point.price_per_kg)}</td></tr>`).join('');
    $('demand-status').textContent = `${data.commodity} / ${data.mandi} · ${copy[language].ready}`;
  } catch (error) {
    $('demand-result').hidden = true;
    $('demand-status').textContent = error.message || copy[language].error;
  }
  $('demand-run').disabled = false;
}

$('purchase-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  $('purchase-status').textContent = copy[language].saving;
  const quantity = Number($('purchase-quantity').value);
  const price = Number($('purchase-price').value);
  const amount = Number($('purchase-amount').value) || quantity * price;
  const response = await fetch('/api/demand/purchases', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      date: $('purchase-date').value,
      commodity: $('purchase-commodity').value,
      mandi: $('purchase-mandi').value,
      quantity_kg: quantity,
      price_per_kg_inr: price,
      total_amount_inr: amount
    })
  });
  const data = await response.json();
  if (!response.ok) {
    $('purchase-status').textContent = data.error || 'Purchase could not be saved.';
    return;
  }
  $('purchase-status').textContent = copy[language].saved;
  $('demand-commodity').value = $('purchase-commodity').value;
  $('demand-mandi').value = $('purchase-mandi').value;
  await forecastDemand();
});

$('demand-run').addEventListener('click', forecastDemand);
$('demand-commodity').addEventListener('change', () => { $('purchase-commodity').value = $('demand-commodity').value; });
$('demand-mandi').addEventListener('change', () => { $('purchase-mandi').value = $('demand-mandi').value; });
$('purchase-quantity').addEventListener('input', () => {
  const amount = Number($('purchase-quantity').value) * Number($('purchase-price').value);
  if (amount) $('purchase-amount').value = amount.toFixed(2);
});
$('purchase-price').addEventListener('input', () => {
  const amount = Number($('purchase-quantity').value) * Number($('purchase-price').value);
  if (amount) $('purchase-amount').value = amount.toFixed(2);
});
document.querySelectorAll('[data-language]').forEach((button) => button.addEventListener('click', async () => {
  language = button.dataset.language;
  localStorage.setItem('sahayak-language', language);
  applyLanguage();
  await forecastDemand();
}));
$('purchase-date').value = new Date().toISOString().slice(0, 10);
applyLanguage();
loadDemandOptions();
