import { StaggeredGrid, BentoItem } from "@/components/ui/staggered-grid";
import { FaBriefcase, FaChartLine, FaUsers } from "react-icons/fa";

const sampleImages = [
    "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2940&auto=format&fit=crop", // Business meeting
    "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2940&auto=format&fit=crop", // Deal / Handshake
    "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2940&auto=format&fit=crop", // Presentation
    "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=2940&auto=format&fit=crop", // Professional
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2940&auto=format&fit=crop", // Team
    "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2940&auto=format&fit=crop", // Planning
    "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2940&auto=format&fit=crop", // Modern Office
    "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=2940&auto=format&fit=crop", // Handshake diverse
    "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2940&auto=format&fit=crop", // Office talk
    "https://images.unsplash.com/photo-1531545514256-b1400bc00f31?q=80&w=2940&auto=format&fit=crop", // Collab
    "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=2940&auto=format&fit=crop", // Graph analysis
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2940&auto=format&fit=crop", // Developers
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2940&auto=format&fit=crop", // Accounting
    "https://images.unsplash.com/photo-1664575602276-bc30ec8b8fac?q=80&w=2940&auto=format&fit=crop", // Business woman
    "https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=2940&auto=format&fit=crop", // Corporate workers
    "https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=2940&auto=format&fit=crop", // Strategy
    "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2940&auto=format&fit=crop", // Team huddle
    "https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=2940&auto=format&fit=crop"  // Happy team
];

const sampleBentoItems: BentoItem[] = [
    {
        id: 1,
        title: "Consulting",
        subtitle: "Expert Guidance",
        description: "Strategic advice to help your business scale efficiently and dominate the market.",
        icon: <FaBriefcase size={24} />,
        image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2940&auto=format&fit=crop"
    },
    {
        id: 2,
        title: "Growth",
        subtitle: "Scale Fast",
        description: "Proven strategies to increase revenue and accelerate your market share.",
        icon: <FaChartLine size={24} />,
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2830&auto=format&fit=crop"
    },
    {
        id: 3,
        title: "Hiring",
        subtitle: "Top Talent",
        description: "We find, recruit, and retain the best professionals for your growing team.",
        icon: <FaUsers size={24} />,
        image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2940&auto=format&fit=crop"
    }
];

export function StaggeredGridSection() {
    return (
        <div className="w-full pt-10 pb-20">
            <StaggeredGrid 
                images={sampleImages} 
                bentoItems={sampleBentoItems} 
                centerText="Expertise"
            />
        </div>
    );
}
