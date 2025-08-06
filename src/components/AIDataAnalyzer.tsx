import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Bot, 
  Send, 
  MessageSquare, 
  TrendingUp, 
  Users, 
  Target,
  Sparkles,
  BarChart3,
  PieChart,
  LineChart
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface ChatMessage {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
  charts?: Array<{
    type: string;
    title: string;
    description: string;
  }>;
}

const sampleQuestions = [
  "What's my conversion rate trend for Q1?",
  "Which lead sources perform best?", 
  "Show me deals at risk of falling through",
  "Compare CEO vs VC outreach performance",
  "What are my top performing activities?",
  "Predict next month's revenue"
];

const sampleResponses = {
  "conversion": {
    content: "Your conversion rate has improved steadily from 5.2% in January to 7.1% in April. This represents a 36% improvement quarter-over-quarter. LinkedIn outreach shows the highest conversion at 8.9%, while cold calling converts at 4.2%.",
    charts: [
      { type: "line", title: "Conversion Rate Trend", description: "Monthly conversion rates showing upward trajectory" },
      { type: "bar", title: "Conversion by Source", description: "LinkedIn leads convert 2x better than cold calls" }
    ]
  },
  "sources": {
    content: "LinkedIn generates the highest quality leads with 8.9% conversion rate and $95K average deal size. Referrals have the highest close rate at 12% but lower volume. Website leads convert at 6.2% with shorter sales cycles.",
    charts: [
      { type: "pie", title: "Lead Source Distribution", description: "Breakdown of leads by acquisition channel" },
      { type: "bar", title: "Performance by Source", description: "Conversion rates and deal values compared" }
    ]
  },
  "risk": {
    content: "I've identified 5 deals worth $420K total that show risk signals: no activity in 7+ days, stalled in negotiation stage, or competitor mentions. The TechCorp deal ($95K) needs immediate attention - last contact was 12 days ago.",
    charts: [
      { type: "table", title: "At-Risk Deals", description: "Deals requiring immediate attention with risk factors" }
    ]
  }
};

export function AIDataAnalyzer() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      type: "ai",
      content: "Hi! I'm your AI sales analyst. I can help you understand your sales data, identify trends, and provide actionable insights. What would you like to analyze today?",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      let aiResponse: ChatMessage;
      
      if (inputValue.toLowerCase().includes("conversion")) {
        aiResponse = {
          id: (Date.now() + 1).toString(),
          type: "ai",
          content: sampleResponses.conversion.content,
          timestamp: new Date(),
          charts: sampleResponses.conversion.charts
        };
      } else if (inputValue.toLowerCase().includes("source")) {
        aiResponse = {
          id: (Date.now() + 1).toString(),
          type: "ai",
          content: sampleResponses.sources.content,
          timestamp: new Date(),
          charts: sampleResponses.sources.charts
        };
      } else if (inputValue.toLowerCase().includes("risk")) {
        aiResponse = {
          id: (Date.now() + 1).toString(),
          type: "ai",
          content: sampleResponses.risk.content,
          timestamp: new Date(),
          charts: sampleResponses.risk.charts
        };
      } else {
        aiResponse = {
          id: (Date.now() + 1).toString(),
          type: "ai",
          content: "I've analyzed your data and found some interesting patterns. Your overall performance is trending upward with a 23% increase in qualified leads this quarter. Would you like me to dive deeper into any specific metrics?",
          timestamp: new Date(),
          charts: [
            { type: "line", title: "Performance Overview", description: "Key metrics trending upward" }
          ]
        };
      }

      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const handleQuickQuestion = (question: string) => {
    setInputValue(question);
  };

  const getChartIcon = (type: string) => {
    switch (type) {
      case "line": return LineChart;
      case "bar": return BarChart3;
      case "pie": return PieChart;
      default: return BarChart3;
    }
  };

  return (
    <Card className="bg-gradient-card shadow-card h-[600px] flex flex-col">
      <CardHeader className="border-b border-border">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-gradient-primary rounded-lg">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-foreground">AI Sales Analyst</CardTitle>
            <CardDescription>Ask questions about your sales data and get insights</CardDescription>
          </div>
        </div>
      </CardHeader>

      {/* Quick Questions */}
      <div className="p-4 border-b border-border">
        <p className="text-sm text-muted-foreground mb-2">Quick questions:</p>
        <div className="flex flex-wrap gap-2">
          {sampleQuestions.slice(0, 3).map((question, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => handleQuickQuestion(question)}
              className="text-xs"
            >
              {question}
            </Button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.type === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-background border border-border"
              }`}
            >
              <div className="flex items-start gap-2">
                {message.type === "ai" && (
                  <Bot className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                )}
                <div className="space-y-2">
                  <p className="text-sm">{message.content}</p>
                  
                  {message.charts && message.charts.length > 0 && (
                    <div className="space-y-2">
                      {message.charts.map((chart, index) => {
                        const ChartIcon = getChartIcon(chart.type);
                        return (
                          <div
                            key={index}
                            className="flex items-center gap-2 p-2 bg-secondary/20 rounded border"
                          >
                            <ChartIcon className="h-4 w-4 text-primary" />
                            <div className="flex-1">
                              <p className="text-xs font-medium">{chart.title}</p>
                              <p className="text-xs text-muted-foreground">{chart.description}</p>
                            </div>
                            <Button size="sm" variant="ghost">
                              View
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-muted-foreground">
                  {message.timestamp.toLocaleTimeString()}
                </span>
                {message.type === "ai" && (
                  <Badge variant="outline" className="text-xs">
                    <Sparkles className="h-3 w-3 mr-1" />
                    AI
                  </Badge>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-background border border-border rounded-lg p-3">
              <div className="flex items-center gap-2">
                <Bot className="h-4 w-4 text-primary" />
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-75"></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-150"></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <Textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask about your sales data, trends, or performance..."
            className="min-h-[40px] max-h-[120px] resize-none"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <Button 
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="bg-gradient-primary self-end"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}