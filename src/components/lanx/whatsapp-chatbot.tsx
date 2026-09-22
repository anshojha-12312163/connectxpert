import { useState } from "react";
import { MessageCircle, X, Send, Sparkles, CheckCircle2, Building, User, HelpCircle } from "lucide-react";

interface WhatsAppChatbotProps {
  phoneNumber?: string;
  companyName?: string;
  defaultOpen?: boolean;
}

const INTEREST_OPTIONS = [
  "Strategy & Growth Advisory",
  "Technology & Cloud Consulting",
  "Product & AI Solutions",
  "Enterprise Hiring & Team Scaling",
  "Book a 1-on-1 Consultation",
  "Custom Business Inquiry",
];

export function WhatsAppChatbot({
  phoneNumber = "917307627039",
  companyName = "Ansh Consultancy",
  defaultOpen = false,
}: WhatsAppChatbotProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [name, setName] = useState("");
  const [visitorCompany, setVisitorCompany] = useState("");
  const [interest, setInterest] = useState(INTEREST_OPTIONS[0]);
  const [message, setMessage] = useState("");
  const [hasInteracted, setHasInteracted] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();

    const formattedMessage = `Hi ${companyName} Team!
Name: ${name.trim() || "Website Visitor"}
Company: ${visitorCompany.trim() || "Not specified"}
Interest: ${interest}
Message: ${message.trim() || `I would like to connect with ${companyName}.`}`;

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(formattedMessage)}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Popup Box */}
      {isOpen && (
        <div
          className="mb-4 w-[90vw] max-w-sm sm:w-96 overflow-hidden rounded-2xl border border-white/10 bg-[#0c121e]/95 backdrop-blur-xl shadow-2xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-5"
          style={{ boxShadow: "0 20px 50px rgba(0,0,0,0.6), 0 0 25px rgba(37, 211, 102, 0.15)" }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#128C7E] to-[#25D366] p-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative flex size-10 items-center justify-center rounded-full bg-white/20 text-white font-bold backdrop-blur-sm">
                  <MessageCircle className="size-5" />
                  <span className="absolute bottom-0 right-0 size-2.5 rounded-full bg-green-300 ring-2 ring-[#128C7E]" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 font-semibold text-sm">
                    {companyName} Support
                    <CheckCircle2 className="size-3.5 fill-white text-[#128C7E]" />
                  </div>
                  <p className="text-[11px] text-white/80">Typically replies in under 5 minutes</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-full p-1.5 text-white/80 hover:bg-white/20 hover:text-white transition-colors"
                aria-label="Close Chat"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>

          {/* Chat Body */}
          <div className="p-4 space-y-3.5 max-h-[75vh] overflow-y-auto">
            {/* Agent Welcome Bubble */}
            <div className="flex gap-2.5 items-start">
              <div className="size-7 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 text-xs font-bold mt-0.5">
                AC
              </div>
              <div className="rounded-2xl rounded-tl-none bg-white/5 border border-white/10 p-3 text-xs text-white/90 leading-relaxed shadow-sm">
                <p className="font-medium text-white mb-1 flex items-center gap-1">
                  <Sparkles className="size-3 text-amber-400" /> Welcome to {companyName}!
                </p>
                Please fill in your details below to start a direct WhatsApp conversation with our team.
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSend} className="space-y-3 pt-1">
              {/* Name */}
              <div>
                <label className="block text-[11px] font-medium text-white/70 mb-1 flex items-center gap-1">
                  <User className="size-3 text-emerald-400" /> Your Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setHasInteracted(true);
                  }}
                  placeholder="e.g. John Doe"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white placeholder-white/30 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
                />
              </div>

              {/* Company Name */}
              <div>
                <label className="block text-[11px] font-medium text-white/70 mb-1 flex items-center gap-1">
                  <Building className="size-3 text-emerald-400" /> Visitor Company Name *
                </label>
                <input
                  type="text"
                  required
                  value={visitorCompany}
                  onChange={(e) => {
                    setVisitorCompany(e.target.value);
                    setHasInteracted(true);
                  }}
                  placeholder="e.g. Acme Innovations"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white placeholder-white/30 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
                />
              </div>

              {/* Interest */}
              <div>
                <label className="block text-[11px] font-medium text-white/70 mb-1 flex items-center gap-1">
                  <HelpCircle className="size-3 text-emerald-400" /> Selected Service / Interest
                </label>
                <select
                  value={interest}
                  onChange={(e) => {
                    setInterest(e.target.value);
                    setHasInteracted(true);
                  }}
                  className="w-full rounded-xl border border-white/10 bg-[#161f30] px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all cursor-pointer"
                >
                  {INTEREST_OPTIONS.map((opt) => (
                    <option key={opt} value={opt} className="bg-[#101726] text-white">
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              {/* Message */}
              <div>
                <label className="block text-[11px] font-medium text-white/70 mb-1">
                  Message / Custom Inquiry
                </label>
                <textarea
                  rows={2}
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    setHasInteracted(true);
                  }}
                  placeholder="Describe your requirement or questions..."
                  className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white placeholder-white/30 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
                />
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full group flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#25D366] to-[#128C7E] py-2.5 px-4 text-xs font-semibold text-white shadow-lg shadow-emerald-950/40 hover:brightness-110 active:scale-[0.98] transition-all"
              >
                <span>Send to WhatsApp</span>
                <Send className="size-3.5 transition-transform group-hover:translate-x-0.5" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating WhatsApp Action Button */}
      <div className="relative group">
        {!isOpen && !hasInteracted && (
          <div className="absolute right-16 bottom-2 hidden sm:flex items-center gap-2 whitespace-nowrap rounded-xl border border-white/10 bg-[#0c121e]/90 px-3 py-1.5 text-xs text-white shadow-xl backdrop-blur-md animate-bounce pointer-events-none">
            <span className="size-2 rounded-full bg-[#25D366] animate-ping" />
            <span>Chat with {companyName}</span>
            <div className="absolute -right-1 top-1/2 -translate-y-1/2 border-4 border-transparent border-l-[#0c121e]/90" />
          </div>
        )}

        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl hover:bg-[#20bd5a] hover:scale-110 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-[#25D366]/30"
          aria-label={isOpen ? "Close WhatsApp Chat" : "Open WhatsApp Chat"}
          style={{
            boxShadow: "0 8px 25px rgba(37, 211, 102, 0.4)",
          }}
        >
          {isOpen ? (
            <X className="size-6 text-white" />
          ) : (
            <svg viewBox="0 0 24 24" className="size-7 fill-current" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
