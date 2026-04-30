import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserPlus, 
  Megaphone, 
  Vote, 
  BarChart4, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  Info,
  HelpCircle,
  Award,
  MessageSquare,
  X,
  Send
} from 'lucide-react';

const electionSteps = [
  {
    id: 1,
    title: 'Voter Registration',
    icon: <UserPlus size={28} />,
    description: 'The first and most crucial step. Ensure your name is on the electoral roll.',
    details: 'To vote, you must be a registered voter. This involves filling out Form 6 (in India) or the equivalent in your country. You need to provide proof of identity, age, and residence. Registration can often be done online through the Election Commission website or offline via a Booth Level Officer (BLO).',
    badges: ['Age 18+', 'Citizenship Required', 'Address Proof'],
    timeline: 'Usually completed weeks before election day'
  },
  {
    id: 2,
    title: 'Candidates & Campaigns',
    icon: <Megaphone size={28} />,
    description: 'Understand who is running and what they stand for.',
    details: 'Candidates file their nominations, which are scrutinized. Once finalized, they begin campaigning. This phase involves rallies, debates, and manifesto releases. As a voter, this is your time to research candidates, understand their promises, and evaluate their past performance.',
    badges: ['Manifestos', 'Rallies', 'Debates'],
    timeline: '2-4 weeks leading up to the election'
  },
  {
    id: 3,
    title: 'Election Day (Polling)',
    icon: <Vote size={28} />,
    description: 'Cast your vote at your designated polling booth.',
    details: 'On polling day, you visit your designated polling station. You must carry a valid ID (like a Voter ID card). Once your identity is verified, your finger is marked with indelible ink. You then cast your vote securely, either via an Electronic Voting Machine (EVM) or a paper ballot. Remember, your vote is secret.',
    badges: ['Voter ID Card', 'Polling Booth', 'Secret Ballot'],
    timeline: 'Election Day (Usually 7 AM - 6 PM)'
  },
  {
    id: 4,
    title: 'Counting & Results',
    icon: <BarChart4 size={28} />,
    description: 'Votes are tallied and the winner is officially declared.',
    details: 'After polling concludes, EVMs or ballot boxes are sealed and kept in strong rooms under heavy security. On the scheduled counting day, they are opened in the presence of candidates or their agents. Votes are tallied, and the Election Commission officially declares the results.',
    badges: ['EVMs', 'Strong Rooms', 'Result Declaration'],
    timeline: 'A few days after polling'
  },
  {
    id: 5,
    title: 'Government Formation',
    icon: <CheckCircle2 size={28} />,
    description: 'The winning party or coalition forms the new government.',
    details: 'The party or coalition that secures a majority of seats in the legislature is invited to form the government. Their chosen leader is sworn in as the head of the government (e.g., Prime Minister or Chief Minister), and they subsequently form their cabinet of ministers.',
    badges: ['Majority', 'Swearing-in', 'Cabinet Formation'],
    timeline: 'Following the results declaration'
  }
];

const quizQuestions = [
  {
    question: "What is the minimum age to vote in most democratic elections?",
    options: ["16 Years", "18 Years", "21 Years", "25 Years"],
    correct: 1
  },
  {
    question: "What does EVM stand for?",
    options: ["Election Verification Member", "Electoral Validation Mechanism", "Electronic Voting Machine", "Every Voter Matters"],
    correct: 2
  },
  {
    question: "Who officially declares the election results?",
    options: ["The Prime Minister", "The Supreme Court", "The Election Commission", "The Police Department"],
    correct: 2
  }
];

function App() {
  const [expandedStep, setExpandedStep] = useState(null);
  const [quizScore, setQuizScore] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  
  // Chat Assistant State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { text: "Hi there! I am your AI Election Assistant. Ask me anything about the voting process, timelines, or how to register, and I'll give you a detailed answer!", isBot: true }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const toggleStep = (id) => {
    setExpandedStep(expandedStep === id ? null : id);
  };

  const handleAnswer = (index) => {
    if (index === quizQuestions[currentQuestion].correct) {
      setQuizScore((prev) => (prev || 0) + 1);
    } else if (quizScore === null) {
      setQuizScore(0);
    }
    
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setCurrentQuestion(-1);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isChatOpen) {
      scrollToBottom();
    }
  }, [chatMessages, isChatOpen, isTyping]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage = chatInput.trim();
    setChatMessages(prev => [...prev, { text: userMessage, isBot: false }]);
    setChatInput("");
    setIsTyping(true);

    try {
      // Custom Client-Side "LLM" Simulation Model
      const processWithLocalModel = async (input) => {
        return new Promise((resolve) => {
          setTimeout(() => {
            const query = input.toLowerCase();
            
            // Extensive intent mapping for Election Process and voters.eci.gov.in functionality
            const intents = [
              { keywords: ['new registration', 'register', 'apply new', 'form 6', 'first time voter', '18', 'enroll', 'create voter card', 'make voter card'], response: "To register as a new voter, you need to fill out <b>Form 6</b>. You'll need proof of identity and address.<br/><br/><a href='https://voters.eci.gov.in/login' target='_blank' style='color: #818cf8; text-decoration: underline; font-weight: 500;'>Click here to Apply for New Voter ID (Form 6)</a>" },
              { keywords: ['nri', 'overseas', 'foreign', 'form 6a'], response: "If you are an NRI or an Overseas Elector, you must fill out <b>Form 6A</b> to register to vote in India.<br/><br/><a href='https://voters.eci.gov.in/login' target='_blank' style='color: #818cf8; text-decoration: underline; font-weight: 500;'>Click here to fill Form 6A</a>" },
              { keywords: ['aadhaar', 'link', 'form 6b', 'authenticate'], response: "To link your Aadhaar card with your Voter ID for authentication, you can submit <b>Form 6B</b>.<br/><br/><a href='https://voters.eci.gov.in/login' target='_blank' style='color: #818cf8; text-decoration: underline; font-weight: 500;'>Click here to Link Aadhaar (Form 6B)</a>" },
              { keywords: ['delete', 'remove', 'objection', 'death', 'form 7'], response: "If you want to object to an inclusion or request the deletion of a name (e.g., due to shifting or death), you need to submit <b>Form 7</b>.<br/><br/><a href='https://voters.eci.gov.in/login' target='_blank' style='color: #818cf8; text-decoration: underline; font-weight: 500;'>Click here for Form 7</a>" },
              { keywords: ['shift', 'correction', 'change address', 'change name', 'replacement', 'epic replacement', 'pwd', 'form 8', 'mistake', 'update'], response: "For shifting residence, correcting name/address mistakes, or getting a replacement Voter ID, fill out <b>Form 8</b>.<br/><br/><a href='https://voters.eci.gov.in/login' target='_blank' style='color: #818cf8; text-decoration: underline; font-weight: 500;'>Click here for Form 8 (Corrections/Shift)</a>" },
              { keywords: ['track', 'status', 'reference number', 'application status'], response: "You can track the status of your submitted forms using your Reference Number.<br/><br/><a href='https://voters.eci.gov.in/home/track' target='_blank' style='color: #818cf8; text-decoration: underline; font-weight: 500;'>Click here to Track Application Status</a>" },
              { keywords: ['search', 'electoral roll', 'find name', 'epic number', 'my name in list'], response: "You can search if your name is on the voter list by details, EPIC number, or mobile number.<br/><br/><a href='https://electoralsearch.eci.gov.in/' target='_blank' style='color: #818cf8; text-decoration: underline; font-weight: 500;'>Click here to Search in Electoral Roll</a>" },
              { keywords: ['download epic', 'e-epic', 'digital voter id', 'pdf'], response: "You can download a digital PDF version of your Voter ID card (e-EPIC) if your mobile number is linked.<br/><br/><a href='https://voters.eci.gov.in/login' target='_blank' style='color: #818cf8; text-decoration: underline; font-weight: 500;'>Click here to Download e-EPIC</a>" },
              { keywords: ['polling station', 'booth', 'blo', 'ero', 'officer'], response: "To find your Polling Station or contact details of your Booth Level Officer (BLO) and ERO.<br/><br/><a href='https://electoralsearch.eci.gov.in/pollingstation' target='_blank' style='color: #818cf8; text-decoration: underline; font-weight: 500;'>Click here to Know your Polling Station & Officer</a>" },
              { keywords: ['evm', 'machine', 'electronic', 'button', 'vvpat', 'cast'], response: "An EVM (Electronic Voting Machine) is a secure device used to cast votes electronically. A VVPAT machine alongside it prints a slip so you can verify your vote." },
              { keywords: ['when', 'timeline', 'date', 'time', 'schedule', 'day', 'close'], response: "Election timelines vary. Usually, registration closes weeks before polling. Polling happens on a single day (often 7 AM to 6 PM), and results come a few days later." },
              { keywords: ['who', 'candidate', 'leader', 'party', 'manifesto', 'promise', 'campaign'], response: "During Campaigns, parties release manifestos. You should research candidate past performance and promises before voting." },
              { keywords: ['result', 'win', 'count', 'majority', 'government', 'form', 'prime minister', 'declare'], response: "On counting day, EVMs are tallied. The Election Commission declares the winner, and the majority forms the new government." },
              { keywords: ['process', 'step', 'how to vote', 'election', 'voting', 'summary'], response: "The election process has 5 main steps: 1) Voter Registration (Form 6), 2) Campaigns, 3) Polling Day, 4) Counting & Results, 5) Government Formation. You can do all registration online at <a href='https://voters.eci.gov.in' target='_blank' style='color: #818cf8; text-decoration: underline; font-weight: 500;'>voters.eci.gov.in</a>" },
              
              // Standard Chatbot Functionalities
              { keywords: ['contact', 'number', 'customer', 'support', 'helpline', 'helpdesk', 'call', 'phone', 'care'], response: "For any election-related queries or complaints, you can call the <b>National Electoral Search Toll-Free Helpline Number: 1950</b>.<br/><br/>You can also contact your State's Chief Electoral Officer via the ECI portal." },
              { keywords: ['help', 'menu', 'options', 'what can you do', 'features'], response: "Here is what I can help you with:<br/>• New Voter Registration (Form 6)<br/>• Aadhaar Linking (Form 6B)<br/>• Address/Name Change (Form 8)<br/>• E-EPIC Download<br/>• Application Tracking<br/>• Contact & Helpline Info" },
              { keywords: ['thank', 'thanks', 'dhanyawad', 'shukriya'], response: "You're very welcome! I am always here to help. Remember, your vote is your voice. Happy Voting! 😊" },
              { keywords: ['bye', 'goodbye', 'see you', 'exit'], response: "Goodbye! Have a great day and don't forget to exercise your democratic right to vote!" },
              { keywords: ['good', 'great', 'awesome', 'nice', 'perfect', 'amazing'], response: "Thank you for the kind words! I am glad I could be of assistance. Let me know if you need anything else." },

              { keywords: ['hello', 'hi', 'hey', 'start', 'morning', 'evening'], response: "Hello! I am your AI Election Assistant. Ask me about Form 6 (new voter registration), Form 8 (corrections), downloading e-EPIC, tracking status, or general election processes!" },
              { keywords: ['what is', 'why', 'democracy', 'meaning'], response: "Democracy is a system where citizens choose leaders through free and fair elections. Your vote is your voice!" },
              { keywords: ['secret', 'safe', 'privacy'], response: "Voting is completely secret. The EVM does not record your name alongside your vote, ensuring your privacy." }
            ];

            let bestMatch = null;
            let maxScore = 0;

            for (const intent of intents) {
              let score = 0;
              for (const kw of intent.keywords) {
                // If the user's query contains the keyword (case insensitive)
                if (query.includes(kw.toLowerCase())) {
                  score++;
                }
              }
              if (score > maxScore) {
                maxScore = score;
                bestMatch = intent;
              }
            }

            if (bestMatch && maxScore > 0) {
              resolve(bestMatch.response);
            } else {
              // Strict Domain boundary enforcement
              resolve("I am strictly an Election Process Assistant. I can only answer questions related to voting, candidates, EVMs, campaigns, and democratic processes. Please ask an election-related question!");
            }
          }, 800 + Math.random() * 1000); // Simulate network latency and "thinking" time
        });
      };

      const botResponse = await processWithLocalModel(userMessage);
      setChatMessages(prev => [...prev, { text: botResponse, isBot: true }]);
    } catch (error) {
      setChatMessages(prev => [...prev, { text: "Sorry, an error occurred in my local processing engine.", isBot: true }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="app-container">
      <header>
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          Election Process Education
        </motion.h1>
        <motion.p 
          className="subtitle"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          An interactive walkthrough of how democratic elections work, from registration to government formation.
        </motion.p>
      </header>

      <main className="timeline">
        {electionSteps.map((step, index) => (
          <motion.div 
            key={step.id}
            className="step-card"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.15 }}
            onClick={() => toggleStep(step.id)}
          >
            <div className="step-marker" />
            
            <div className="step-header">
              <div className="step-icon">
                {step.icon}
              </div>
              <div className="step-title">
                <span>{step.id}. {step.title}</span>
                {expandedStep === step.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>
            </div>
            
            <p className="step-content">{step.description}</p>
            
            <AnimatePresence>
              {expandedStep === step.id && (
                <motion.div 
                  className="step-details"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                    <Info size={18} color="var(--accent)" />
                    <h4 style={{ margin: 0 }}>Detailed Process</h4>
                  </div>
                  <p>{step.details}</p>
                  
                  <div style={{ marginTop: '1.5rem' }}>
                    <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)' }}>
                      Timeline: {step.timeline}
                    </h4>
                    <div className="badges">
                      {step.badges.map(badge => (
                        <span key={badge} className="badge">{badge}</span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </main>

      {!showQuiz && (
        <motion.div 
          className="nav-buttons"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <button className="btn" onClick={() => setShowQuiz(true)}>
            <HelpCircle size={20} /> Test Your Knowledge
          </button>
          <button className="btn btn-secondary" onClick={() => setExpandedStep(null)}>
            Collapse All
          </button>
        </motion.div>
      )}

      <AnimatePresence>
        {showQuiz && (
          <motion.section 
            className="quiz-section"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="quiz-container step-card" style={{ marginTop: '4rem' }}>
              <div className="step-header">
                <div className="step-icon" style={{ background: 'rgba(236, 72, 153, 0.2)', color: 'var(--secondary)' }}>
                  {currentQuestion === -1 ? <Award size={28} /> : <HelpCircle size={28} />}
                </div>
                <div className="step-title">
                  <span>{currentQuestion === -1 ? "Quiz Completed!" : "Election Knowledge Quiz"}</span>
                </div>
              </div>

              {currentQuestion !== -1 ? (
                <div className="quiz-content">
                  <h3 style={{ marginBottom: '1.5rem', fontSize: '1.3rem' }}>
                    Question {currentQuestion + 1} of {quizQuestions.length}
                  </h3>
                  <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
                    {quizQuestions[currentQuestion].question}
                  </p>
                  <div className="quiz-options">
                    {quizQuestions[currentQuestion].options.map((opt, idx) => (
                      <button 
                        key={idx} 
                        className="quiz-btn"
                        onClick={() => handleAnswer(idx)}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="quiz-result" style={{ textAlign: 'center', padding: '2rem 0' }}>
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 10 }}
                  >
                    <Award size={80} color="var(--accent)" style={{ margin: '0 auto', marginBottom: '1rem' }} />
                  </motion.div>
                  <h2>You scored {quizScore} out of {quizQuestions.length}!</h2>
                  <p style={{ color: 'var(--text-muted)', marginTop: '1rem', fontSize: '1.1rem' }}>
                    {quizScore === quizQuestions.length ? "Perfect score! You are a fully informed voter." : "Great effort! Keep learning about the democratic process."}
                  </p>
                  <button className="btn" style={{ margin: '2rem auto 0' }} onClick={() => {
                    setCurrentQuestion(0);
                    setQuizScore(null);
                    setShowQuiz(false);
                  }}>
                    Retake Quiz
                  </button>
                </div>
              )}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Floating Chat Assistant */}
      <div className="chat-widget">
        <AnimatePresence>
          {isChatOpen && (
            <motion.div 
              className="chat-window"
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <div className="chat-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MessageSquare size={20} />
                  <span>Election Assistant</span>
                </div>
                <button className="icon-btn" onClick={() => setIsChatOpen(false)}>
                  <X size={20} />
                </button>
              </div>
              <div className="chat-body">
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`chat-bubble-wrapper ${msg.isBot ? 'bot' : 'user'}`}>
                    {msg.isBot ? (
                      <div className="chat-bubble" dangerouslySetInnerHTML={{ __html: msg.text }} />
                    ) : (
                      <div className="chat-bubble">
                        {msg.text}
                      </div>
                    )}
                  </div>
                ))}
                {isTyping && (
                  <div className="chat-bubble-wrapper bot">
                    <div className="chat-bubble" style={{ fontStyle: 'italic', opacity: 0.7 }}>
                      Typing...
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              <form className="chat-input-area" onSubmit={handleSendMessage}>
                <input 
                  type="text" 
                  placeholder="Ask a question..." 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                />
                <button type="submit" className="send-btn" disabled={!chatInput.trim()}>
                  <Send size={18} />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button 
          className="chat-fab"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsChatOpen(!isChatOpen)}
        >
          {isChatOpen ? <X size={28} /> : <MessageSquare size={28} />}
        </motion.button>
      </div>
    </div>
  );
}

export default App;
