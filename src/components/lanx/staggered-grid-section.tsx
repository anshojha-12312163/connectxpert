import { StaggeredGrid, BentoItem } from "@/components/ui/staggered-grid";
import { FaLaptopCode, FaChartLine, FaUsers } from "react-icons/fa";

const sampleImages = [
    "https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=2850&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2940&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2940&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2940&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2940&auto=format&fit=crop"
];

const sampleBentoItems: BentoItem[] = [
    {
        id: 1,
        title: "Development",
        subtitle: "Build faster",
        description: "Accelerate your development cycle with our cutting-edge tools.",
        icon: <FaLaptopCode size={24} />,
        image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2944&auto=format&fit=crop"
    },
    {
        id: 2,
        title: "Analytics",
        subtitle: "Understand your users",
        description: "Get deep insights into user behavior and metrics.",
        icon: <FaChartLine size={24} />,
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2940&auto=format&fit=crop"
    },
    {
        id: 3,
        title: "Collaboration",
        subtitle: "Work together seamlessly",
        description: "Connect your team with real-time collaboration features.",
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
                centerText="Innovation"
            />
        </div>
    );
}
