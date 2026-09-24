const $ = (id) => document.getElementById(id);
let chart;
let language = localStorage.getItem('sahayak-language') || 'en';

const copy = {
  en: {
    feed: 'MANUAL DELHI + PATNA FEED', marketNav: 'Mandi Bazaar', forecastNav: 'Kisan Desk',
    eyebrow: 'SIH 2026 · SMART MANDI ASSISTANT', heroTitle: 'Connect farmers directly to buyers and smart logistics',
    heroBody: 'See transparent mandi prices, get AI-powered demand forecasts, and choose a better time to sell your produce.',
    seeMarket: 'See the market', makeForecast: 'View your price forecast', metricOne: 'Better prices than middlemen', metricOneSub: 'Direct farmer sourcing',
    metricTwo: 'Average farmer net income lift', metricTwoSub: 'Saved commission retained', metricThree: 'Reduction in crop distress sales', metricThreeSub: 'Better timing with forecasts', metricFour: 'Transport and fuel savings', metricFourSub: 'Consolidated route planning',
    marketEyebrow: 'MANDI BAZAAR · BIHAR', workspaceTitle: 'Today’s market, tomorrow’s plan', workspaceBody: 'Choose your crop and mandi. The model uses the available market sequence to prepare the next-days outlook.', anchored: 'Anchored to today', commodity: 'Commodity', market: 'Market', horizon: 'Horizon', run: 'Run price forecast', latest: 'Latest observed modal', perQuintal: 'per quintal', midpoint: 'Forecast midpoint', selectedHorizon: 'next selected horizon', sequence: 'Observed sequence', marketRecords: 'ordered market records', tomorrowEyebrow: 'NEXT MARKET DAY', tomorrowTitle: "Tomorrow's predicted price", tomorrowBody: 'The first model estimate for your selected commodity and market.', curve: 'FORWARD CURVE', curveTitle: 'Expected modal price', daily: 'DAILY VIEW', ledger: 'Forecast ledger', date: 'Date', expected: 'Expected modal price', signal: 'Signal', disclaimer: 'Forecasts are directional estimates. Source dates are treated as ordering information and every prediction is anchored to today.', days: 'days', training: 'Training on the selected market sequence...', ready: 'day outlook ready', unavailable: 'Not enough records for this produce and mandi.', error: 'Could not calculate this selection.'
  },
  hi: {
    feed: 'एगमार्कनेट मंडी फीड', marketNav: 'मंडी बाज़ार', forecastNav: 'किसान डेस्क',
    eyebrow: 'SIH 2026 · स्मार्ट मंडी सहायक', heroTitle: 'किसानों को सीधे खरीदार और स्मार्ट लॉजिस्टिक्स से जोड़ना',
    heroBody: 'पारदर्शी मंडी भाव जानें, एआई द्वारा मांग का पूर्वानुमान देखें और बेहतर समय पर अपनी उपज बेचें।',
    seeMarket: 'बाज़ार देखें', makeForecast: 'अपना भाव अनुमान देखें', metricOne: 'बिचौलियों से बेहतर भाव', metricOneSub: 'सीधे किसान से खरीद',
    metricTwo: 'किसान की औसत शुद्ध आय वृद्धि', metricTwoSub: 'कमीशन की बचत', metricThree: 'फसल बिक्री में कमी', metricThreeSub: 'पूर्वानुमान से बेहतर समय', metricFour: 'परिवहन और ईंधन की बचत', metricFourSub: 'संगठित मार्ग योजना',
    marketEyebrow: 'मंडी बाज़ार · बिहार', workspaceTitle: 'आज का बाज़ार, कल की तैयारी', workspaceBody: 'अपनी फसल और मंडी चुनें। मॉडल उपलब्ध बाजार क्रम से अगले दिनों का अनुमान तैयार करता है।', anchored: 'आज की तारीख', commodity: 'फसल', market: 'मंडी', horizon: 'अवधि', run: 'भाव अनुमान चलाएं', latest: 'नवीनतम मंडी भाव', perQuintal: 'प्रति क्विंटल', midpoint: 'अनुमानित औसत भाव', selectedHorizon: 'चुनी गई अवधि', sequence: 'उपलब्ध रिकॉर्ड', marketRecords: 'क्रमबद्ध बाजार रिकॉर्ड', tomorrowEyebrow: 'अगला बाजार दिन', tomorrowTitle: 'कल का अनुमानित भाव', tomorrowBody: 'आपकी चुनी हुई फसल और मंडी के लिए मॉडल का पहला अनुमान।', curve: 'आगे का अनुमान', curveTitle: 'अनुमानित मंडी भाव', daily: 'दैनिक विवरण', ledger: 'भाव अनुमान सूची', date: 'तारीख', expected: 'अनुमानित भाव', signal: 'संकेत', disclaimer: 'यह अनुमान दिशात्मक है। स्रोत की तारीखों का उपयोग केवल क्रम के लिए किया गया है और हर अनुमान आज से शुरू होता है।', days: 'दिन', training: 'चयनित बाजार क्रम पर प्रशिक्षण चल रहा है...', ready: 'दिन का अनुमान तैयार', unavailable: 'इस फसल और मंडी के लिए पर्याप्त रिकॉर्ड नहीं हैं।', error: 'इस चयन की गणना नहीं हो सकी।'
  },
  mr: {
    feed: 'एगमार्कनेट मंडी फीड', marketNav: 'मंडी बाजार', forecastNav: 'शेतकरी डेस्क', eyebrow: 'SIH 2026 · स्मार्ट मंडी सहाय्यक', heroTitle: 'शेतकऱ्यांना थेट खरेदीदार आणि स्मार्ट लॉजिस्टिक्सशी जोडा', heroBody: 'पारदर्शक मंडी भाव पहा, एआय अंदाज मिळवा आणि पीक विकण्यासाठी योग्य वेळ निवडा.', seeMarket: 'बाजार पहा', makeForecast: 'भावाचा अंदाज पहा', metricOne: 'दलालांपेक्षा चांगला भाव', metricOneSub: 'थेट शेतकरी खरेदी', metricTwo: 'शेतकऱ्यांच्या निव्वळ उत्पन्नात वाढ', metricTwoSub: 'वाचवलेले कमिशन', metricThree: 'घाईने होणारी पीक विक्री कमी', metricThreeSub: 'अंदाजामुळे योग्य वेळ', metricFour: 'वाहतूक आणि इंधन बचत', metricFourSub: 'एकत्रित मार्ग नियोजन', marketEyebrow: 'मंडी बाजार · बिहार', workspaceTitle: 'आजचा बाजार, उद्याची तयारी', workspaceBody: 'तुमचे पीक आणि मंडी निवडा. मॉडेल पुढील दिवसांचा अंदाज तयार करते.', anchored: 'आजची तारीख', commodity: 'पीक', market: 'मंडी', horizon: 'कालावधी', run: 'अंदाज चालवा', latest: 'नवीनतम मंडी भाव', perQuintal: 'प्रति क्विंटल', midpoint: 'अंदाजे सरासरी भाव', selectedHorizon: 'निवडलेला कालावधी', sequence: 'उपलब्ध नोंदी', marketRecords: 'बाजार नोंदी', tomorrowEyebrow: 'पुढील बाजार दिवस', tomorrowTitle: 'उद्याचा अंदाजित भाव', tomorrowBody: 'निवडलेल्या पिकासाठी मॉडेलचा पहिला अंदाज.', curve: 'पुढील अंदाज', curveTitle: 'अपेक्षित मंडी भाव', daily: 'दैनिक माहिती', ledger: 'भाव अंदाज यादी', date: 'तारीख', expected: 'अपेक्षित मंडी भाव', signal: 'संकेत', disclaimer: 'हे दिशादर्शक अंदाज आहेत. प्रत्येक अंदाज आजपासून सुरू होतो.', days: 'दिवस', training: 'निवडलेल्या बाजार क्रमावर प्रशिक्षण सुरू आहे...', ready: 'दिवसांचा अंदाज तयार', unavailable: 'या पिकासाठी आणि मंडीसाठी पुरेशा नोंदी नाहीत.', error: 'या निवडीची गणना करता आली नाही.'
  },
  ta: {
    feed: 'அக்மார்க்நெட் மண்டி ஊட்டம்', marketNav: 'மண்டி சந்தை', forecastNav: 'விவசாயி மேசை', eyebrow: 'SIH 2026 · ஸ்மார்ட் மண்டி உதவியாளர்', heroTitle: 'விவசாயிகளை நேரடியாக வாங்குபவர்கள் மற்றும் ஸ்மார்ட் லாஜிஸ்டிக்ஸுடன் இணைக்கவும்', heroBody: 'வெளிப்படையான மண்டி விலைகளைப் பார்த்து, AI கணிப்பைப் பெற்று, சரியான விற்பனை நேரத்தைத் தேர்வு செய்யுங்கள்.', seeMarket: 'சந்தையைப் பார்க்க', makeForecast: 'விலை கணிப்பைப் பார்க்க', metricOne: 'தரகர்களைவிட சிறந்த விலை', metricOneSub: 'நேரடி விவசாயி கொள்முதல்', metricTwo: 'விவசாயிகளின் சராசரி நிகர வருமான உயர்வு', metricTwoSub: 'சேமித்த கமிஷன்', metricThree: 'அவசர பயிர் விற்பனை குறைவு', metricThreeSub: 'கணிப்புடன் சிறந்த நேரம்', metricFour: 'போக்குவரத்து மற்றும் எரிபொருள் சேமிப்பு', metricFourSub: 'ஒருங்கிணைந்த பாதை திட்டமிடல்', marketEyebrow: 'மண்டி சந்தை · பீகார்', workspaceTitle: 'இன்றைய சந்தை, நாளைய திட்டம்', workspaceBody: 'பயிரையும் மண்டியையும் தேர்வு செய்யுங்கள். மாடல் அடுத்த நாட்களுக்கான கணிப்பை உருவாக்கும்.', anchored: 'இன்றைய தேதி', commodity: 'பயிர்', market: 'மண்டி', horizon: 'கால அளவு', run: 'கணிப்பை இயக்கவும்', latest: 'சமீபத்திய மண்டி விலை', perQuintal: 'குவிண்டாலுக்கு', midpoint: 'கணிப்பு சராசரி', selectedHorizon: 'தேர்ந்த கால அளவு', sequence: 'கிடைக்கும் பதிவுகள்', marketRecords: 'சந்தை பதிவுகள்', tomorrowEyebrow: 'அடுத்த சந்தை நாள்', tomorrowTitle: 'நாளைய கணிக்கப்பட்ட விலை', tomorrowBody: 'தேர்ந்த பயிர் மற்றும் மண்டிக்கான முதல் கணிப்பு.', curve: 'முன்னோக்கு கணிப்பு', curveTitle: 'எதிர்பார்க்கப்படும் மண்டி விலை', daily: 'தினசரி பார்வை', ledger: 'விலை கணிப்பு பட்டியல்', date: 'தேதி', expected: 'எதிர்பார்க்கப்படும் விலை', signal: 'சமிக்ஞை', disclaimer: 'கணிப்புகள் வழிகாட்டுதலுக்கானவை. ஒவ்வொரு கணிப்பும் இன்றிலிருந்து தொடங்குகிறது.', days: 'நாட்கள்', training: 'தேர்ந்த சந்தை வரிசையில் பயிற்சி நடைபெறுகிறது...', ready: 'நாள் கணிப்பு தயார்', unavailable: 'இந்த பயிர் மற்றும் மண்டிக்கு போதுமான பதிவுகள் இல்லை.', error: 'இந்தத் தேர்வைக் கணக்கிட முடியவில்லை.'
  },
  gu: {
    feed: 'એગ્રિમાર્કનેટ મંડી ફીડ', marketNav: 'મંડી બજાર', forecastNav: 'ખેડૂત ડેસ્ક', eyebrow: 'SIH 2026 · સ્માર્ટ મંડી સહાયક', heroTitle: 'ખેડૂતોને સીધા ખરીદદારો અને સ્માર્ટ લોજિસ્ટિક્સ સાથે જોડો', heroBody: 'પારદર્શક મંડી ભાવ જુઓ, AI આગાહી મેળવો અને પાક વેચવાનો યોગ્ય સમય પસંદ કરો.', seeMarket: 'બજાર જુઓ', makeForecast: 'ભાવની આગાહી જુઓ', metricOne: 'વચેટિયા કરતાં સારો ભાવ', metricOneSub: 'સીધી ખેડૂત ખરીદી', metricTwo: 'ખેડૂતની સરેરાશ ચોખ્ખી આવકમાં વધારો', metricTwoSub: 'બચાવેલું કમિશન', metricThree: 'ઉતાવળમાં પાક વેચાણમાં ઘટાડો', metricThreeSub: 'આગાહીથી યોગ્ય સમય', metricFour: 'પરિવહન અને ઇંધણની બચત', metricFourSub: 'એકત્રિત માર્ગ આયોજન', marketEyebrow: 'મંડી બજાર · બિહાર', workspaceTitle: 'આજનું બજાર, આવતીકાલની યોજના', workspaceBody: 'તમારો પાક અને મંડી પસંદ કરો. મોડેલ આગામી દિવસોની આગાહી તૈયાર કરશે.', anchored: 'આજની તારીખ', commodity: 'પાક', market: 'મંડી', horizon: 'સમયગાળો', run: 'આગાહી ચલાવો', latest: 'તાજેતરનો મંડી ભાવ', perQuintal: 'પ્રતિ ક્વિન્ટલ', midpoint: 'આગાહી સરેરાશ', selectedHorizon: 'પસંદ કરેલો સમયગાળો', sequence: 'ઉપલબ્ધ રેકોર્ડ', marketRecords: 'બજાર રેકોર્ડ', tomorrowEyebrow: 'આગળનો બજાર દિવસ', tomorrowTitle: 'આવતીકાલનો અનુમાનિત ભાવ', tomorrowBody: 'પસંદ કરેલા પાક અને મંડી માટે મોડેલની પ્રથમ આગાહી.', curve: 'આગળની આગાહી', curveTitle: 'અપેક્ષિત મંડી ભાવ', daily: 'દૈનિક દૃશ્ય', ledger: 'ભાવ આગાહી યાદી', date: 'તારીખ', expected: 'અપેક્ષિત મંડી ભાવ', signal: 'સંકેત', disclaimer: 'આ આગાહીઓ માર્ગદર્શક છે. દરેક આગાહી આજથી શરૂ થાય છે.', days: 'દિવસ', training: 'પસંદ કરેલા બજાર ક્રમ પર તાલીમ ચાલી રહી છે...', ready: 'દિવસની આગાહી તૈયાર', unavailable: 'આ પાક અને મંડી માટે પૂરતા રેકોર્ડ નથી.', error: 'આ પસંદગીની ગણતરી થઈ શકી નથી.'
  },
  bn: {
    feed: 'এগ্রিমার্কনেট মন্ডি ফিড', marketNav: 'মন্ডি বাজার', forecastNav: 'কৃষক ডেস্ক', eyebrow: 'SIH 2026 · স্মার্ট মন্ডি সহায়ক', heroTitle: 'কৃষকদের সরাসরি ক্রেতা ও স্মার্ট লজিস্টিক্সের সঙ্গে যুক্ত করুন', heroBody: 'স্বচ্ছ মন্ডি দাম দেখুন, AI পূর্বাভাস পান এবং ফসল বিক্রির সঠিক সময় বেছে নিন।', seeMarket: 'বাজার দেখুন', makeForecast: 'দামের পূর্বাভাস দেখুন', metricOne: 'দালালের চেয়ে ভালো দাম', metricOneSub: 'সরাসরি কৃষক সংগ্রহ', metricTwo: 'কৃষকের গড় নিট আয় বৃদ্ধি', metricTwoSub: 'সাশ্রয় করা কমিশন', metricThree: 'চাপে ফসল বিক্রি কমেছে', metricThreeSub: 'পূর্বাভাসে ভালো সময়', metricFour: 'পরিবহন ও জ্বালানি সাশ্রয়', metricFourSub: 'সমন্বিত রুট পরিকল্পনা', marketEyebrow: 'মন্ডি বাজার · বিহার', workspaceTitle: 'আজকের বাজার, আগামীর পরিকল্পনা', workspaceBody: 'আপনার ফসল ও মন্ডি বেছে নিন। মডেল পরের দিনের পূর্বাভাস তৈরি করবে।', anchored: 'আজকের তারিখ', commodity: 'ফসল', market: 'মন্ডি', horizon: 'সময়কাল', run: 'পূর্বাভাস চালান', latest: 'সর্বশেষ মন্ডি দাম', perQuintal: 'প্রতি কুইন্টাল', midpoint: 'পূর্বাভাসের গড়', selectedHorizon: 'নির্বাচিত সময়কাল', sequence: 'উপলব্ধ রেকর্ড', marketRecords: 'বাজার রেকর্ড', tomorrowEyebrow: 'পরের বাজার দিন', tomorrowTitle: 'আগামীকালের পূর্বাভাসিত দাম', tomorrowBody: 'নির্বাচিত ফসল ও মন্ডির জন্য মডেলের প্রথম পূর্বাভাস।', curve: 'পরবর্তী পূর্বাভাস', curveTitle: 'প্রত্যাশিত মন্ডি দাম', daily: 'দৈনিক দৃশ্য', ledger: 'দাম পূর্বাভাস তালিকা', date: 'তারিখ', expected: 'প্রত্যাশিত মন্ডি দাম', signal: 'সংকেত', disclaimer: 'পূর্বাভাসগুলি দিকনির্দেশমূলক। প্রতিটি পূর্বাভাস আজ থেকে শুরু হয়।', days: 'দিন', training: 'নির্বাচিত বাজার ক্রমে প্রশিক্ষণ চলছে...', ready: 'দিনের পূর্বাভাস প্রস্তুত', unavailable: 'এই ফসল ও মন্ডির জন্য পর্যাপ্ত রেকর্ড নেই।', error: 'এই নির্বাচন গণনা করা যায়নি।'
  },
  te: {
    feed: 'అగ్రిమార్క్‌నెట్ మండి ఫీడ్', marketNav: 'మండి బజార్', forecastNav: 'రైతు డెస్క్', eyebrow: 'SIH 2026 · స్మార్ట్ మండి సహాయకుడు', heroTitle: 'రైతులను నేరుగా కొనుగోలుదారులు మరియు స్మార్ట్ లాజిస్టిక్స్‌తో కలపండి', heroBody: 'పారదర్శక మండి ధరలను చూడండి, AI అంచనాలను పొందండి మరియు పంట అమ్మకానికి సరైన సమయాన్ని ఎంచుకోండి.', seeMarket: 'మార్కెట్ చూడండి', makeForecast: 'ధర అంచనాను చూడండి', metricOne: 'మధ్యవర్తుల కంటే మెరుగైన ధర', metricOneSub: 'నేరుగా రైతు కొనుగోలు', metricTwo: 'రైతు సగటు నికర ఆదాయ పెరుగుదల', metricTwoSub: 'ఆదా చేసిన కమీషన్', metricThree: 'అత్యవసర పంట అమ్మకాలు తగ్గాయి', metricThreeSub: 'అంచనాతో సరైన సమయం', metricFour: 'రవాణా మరియు ఇంధన ఆదా', metricFourSub: 'సమగ్ర మార్గ ప్రణాళిక', marketEyebrow: 'మండి బజార్ · బీహార్', workspaceTitle: 'నేటి మార్కెట్, రేపటి ప్రణాళిక', workspaceBody: 'మీ పంట మరియు మండిని ఎంచుకోండి. మోడల్ రాబోయే రోజుల అంచనాను సిద్ధం చేస్తుంది.', anchored: 'నేటి తేదీ', commodity: 'పంట', market: 'మండి', horizon: 'కాల వ్యవధి', run: 'అంచనాను అమలు చేయండి', latest: 'తాజా మండి ధర', perQuintal: 'క్వింటాల్‌కు', midpoint: 'అంచనా సగటు', selectedHorizon: 'ఎంచుకున్న వ్యవధి', sequence: 'అందుబాటులోని రికార్డులు', marketRecords: 'మార్కెట్ రికార్డులు', tomorrowEyebrow: 'తదుపరి మార్కెట్ రోజు', tomorrowTitle: 'రేపటి అంచనా ధర', tomorrowBody: 'ఎంచుకున్న పంట మరియు మండికి మోడల్ మొదటి అంచనా.', curve: 'ముందస్తు అంచనా', curveTitle: 'ఆశించిన మండి ధర', daily: 'రోజువారీ వీక్షణ', ledger: 'ధర అంచనా జాబితా', date: 'తేదీ', expected: 'ఆశించిన మండి ధర', signal: 'సంకేతం', disclaimer: 'అంచనాలు దిశానిర్దేశకమైనవి. ప్రతి అంచనా నేటి నుండి ప్రారంభమవుతుంది.', days: 'రోజులు', training: 'ఎంచుకున్న మార్కెట్ క్రమంపై శిక్షణ జరుగుతోంది...', ready: 'రోజుల అంచనా సిద్ధంగా ఉంది', unavailable: 'ఈ పంట మరియు మండికి తగినన్ని రికార్డులు లేవు.', error: 'ఈ ఎంపికను లెక్కించలేకపోయాము.'
  }
};

const signalCopy = {
  en: ['Starting point', 'Rising', 'Softening', 'Not increasing'], hi: ['शुरुआत', 'बढ़ रहा है', 'कम हो रहा है', 'बढ़ नहीं रहा है'],
  mr: ['सुरुवातीचा बिंदू', 'वाढत आहे', 'कमी होत आहे', 'वाढ नाही'], ta: ['தொடக்கப் புள்ளி', 'உயர்கிறது', 'குறைகிறது', 'மாற்றமில்லை'],
  gu: ['શરૂઆતનો બિંદુ', 'વધી રહ્યો છે', 'ઘટી રહ્યો છે', 'વધારો નથી'], bn: ['শুরুর বিন্দু', 'বাড়ছে', 'কমছে', 'বাড়ছে না'], te: ['ప్రారంభ స్థానం', 'పెరుగుతోంది', 'తగ్గుతోంది', 'పెరగడం లేదు']
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

function refreshDropdownLabels() {
  ['commodity', 'market'].forEach((id) => {
    document.querySelectorAll(`#${id} option`).forEach((option) => { option.textContent = optionLabel(option.value); });
  });
}

function money(value) { return `₹${Number(value).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`; }

async function loadOptions() {
  const data = await fetch('/api/options').then((response) => response.json());
  $('commodity').innerHTML = data.commodities.map((item) => `<option value="${item}">${optionLabel(item)}</option>`).join('');
  $('commodity').value = data.commodities.includes('Rice') ? 'Rice' : (data.commodities[0] || '');
  await refreshAvailability(true);
}

async function refreshAvailability(preferDefaultMarket = false) {
  const params = new URLSearchParams({ commodity: $('commodity').value });
  const data = await fetch(`/api/options?${params}`).then((response) => response.json());
  $('market').innerHTML = data.markets.map((item) => `<option value="${item}">${optionLabel(item)}</option>`).join('');
  if (preferDefaultMarket && data.markets.includes('Danapur')) $('market').value = 'Danapur';
  else if (data.markets.length) {
    $('market').value = data.markets[0];
    for (const market of data.markets) {
      const marketParams = new URLSearchParams({ commodity: $('commodity').value, market });
      const marketData = await fetch(`/api/options?${marketParams}`).then((response) => response.json());
      if (marketData.horizons.length) {
        $('market').value = market;
        break;
      }
    }
  }
  await refreshHorizons();
}

async function refreshHorizons() {
  const params = new URLSearchParams({ commodity: $('commodity').value, market: $('market').value });
  const data = await fetch(`/api/options?${params}`).then((response) => response.json());
  const current = $('horizon').value;
  $('horizon').innerHTML = data.horizons.map((item) => `<option value="${item}">${item} ${copy[language].days}</option>`).join('');
  if (data.horizons.includes(Number(current))) $('horizon').value = current;
  $('run').disabled = !data.horizons.length;
  if (!data.horizons.length) $('status').textContent = copy[language].unavailable;
  else $('status').textContent = 'Choose the options, then press Run price forecast.';
}

async function runForecast() {
  $('run').disabled = true;
  $('status').textContent = copy[language].training;
  const params = new URLSearchParams({ commodity: $('commodity').value, market: $('market').value, horizon: $('horizon').value });
  try {
    const response = await fetch(`/api/forecast?${params}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    const values = data.forecast.map((point) => point.price);
    $('today').textContent = data.as_of;
    $('tomorrow-date').textContent = data.forecast[0].date;
    $('tomorrow-price').textContent = money(data.forecast[0].price);
    $('latest').textContent = money(data.latest_price);
    $('midpoint').textContent = money(values.reduce((sum, value) => sum + value, 0) / values.length);
    $('observations').textContent = data.observations.toLocaleString('en-IN');
    $('range').textContent = `${data.forecast[0].date} → ${data.forecast.at(-1).date}`;
      $('status').textContent = `${data.commodity} / ${data.market} · ${data.forecast.length} ${copy[language].ready}`;
    renderChart(data.forecast);
      $('rows').innerHTML = data.forecast.map((point, index) => {
        const displayedPrice = Math.round(point.price);
        const previousDisplayedPrice = index > 0 ? Math.round(values[index - 1]) : displayedPrice;
        const signal = index === 0
          ? signalCopy[language][0]
          : displayedPrice > previousDisplayedPrice
            ? signalCopy[language][1]
            : displayedPrice < previousDisplayedPrice
              ? signalCopy[language][2]
              : signalCopy[language][3];
        return `<tr><td>${point.date}</td><td>${money(point.price)}</td><td>${signal}</td></tr>`;
      }).join('');
  } catch (error) { $('status').textContent = copy[language].error; }
  $('run').disabled = false;
}

function renderChart(forecast) {
  if (chart) chart.destroy();
  const chartTextColor = document.body.classList.contains('dark') ? '#d8f3dc' : '#173229';
  const axisTextColor = document.body.classList.contains('dark') ? '#b7cfc0' : '#6d7974';
  chart = new Chart($('chart'), {
    type: 'line',
    data: {
      labels: forecast.map((point) => point.date.slice(5)),
      datasets: [{ data: forecast.map((point) => point.price), borderColor: '#176b59', backgroundColor: '#176b5920', fill: true, tension: .35, pointRadius: 3, pointBackgroundColor: '#e27738' }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        datalabels: { align: 'top', anchor: 'end', color: chartTextColor, font: { size: 10, weight: '700' }, formatter: (value) => `₹${Math.round(value)}` }
      },
      scales: {
        x: { grid: { display: false }, ticks: { maxTicksLimit: 8, color: axisTextColor } },
        y: { grid: { color: document.body.classList.contains('dark') ? '#3a5b4d' : '#e4e7de' }, ticks: { color: axisTextColor, callback: (value) => `₹${value}` } }
      }
    },
    plugins: [ChartDataLabels]
  });
}

$('theme').addEventListener('click', () => {
  document.body.classList.toggle('dark');
  localStorage.setItem('sahayak-theme', document.body.classList.contains('dark') ? 'dark' : 'light');
});

function setLanguage(nextLanguage) {
  language = nextLanguage;
  localStorage.setItem('sahayak-language', language);
  document.documentElement.lang = language === 'hi' ? 'hi' : 'en';
  document.querySelectorAll('[data-i18n]').forEach((element) => { element.textContent = copy[language][element.dataset.i18n]; });
  document.querySelectorAll('[data-language]').forEach((button) => button.classList.toggle('active', button.dataset.language === language));
  refreshDropdownLabels();
  refreshHorizons();
}

document.querySelectorAll('[data-language]').forEach((button) => button.addEventListener('click', () => setLanguage(button.dataset.language)));
$('commodity').addEventListener('change', () => refreshAvailability());
$('market').addEventListener('change', refreshHorizons);
$('run').addEventListener('click', runForecast);
if (localStorage.getItem('sahayak-theme') === 'dark') document.body.classList.add('dark');
document.querySelectorAll('[data-i18n]').forEach((element) => { element.textContent = copy[language][element.dataset.i18n]; });
loadOptions();