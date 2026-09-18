import { StaggeredGrid, BentoItem } from "@/components/ui/staggered-grid";
import { FaBriefcase, FaChartLine, FaUsers } from "react-icons/fa";

const sampleImages = [
    "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2940&auto=format&fit=crop", // Business meeting
    "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2940&auto=format&fit=crop", // Deal / Handshake
    "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2940&auto=format&fit=crop", // Presentation
    "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=2940&auto=format&fit=crop", // Professional
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2940&auto=format&fit=crop"  // Team
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
        <div className="w-full bg-white dark:bg-black py-20">
            <StaggeredGrid 
                images={sampleImages} 
                bentoItems={sampleBentoItems} 
                centerText="Expertise"
            />
        </div>
    );
}
