import { Link } from "react-router-dom";
import { Scissors, Flower2, Droplets, Heart } from "lucide-react";

interface Category {
  id: string;
  name: string;
  value: string;
  icon: string;
  color: string;
  bgColor: string;
}

const categories: Category[] = [
  {
    id: "1",
    name: "Salon for Women",
    value: "salon_for_women",
    icon: "scissors",
    color: "#FF6B9D",
    bgColor: "#FFE5EC",
  },
  {
    id: "2",
    name: "Spa for Women",
    value: "spa_for_women",
    icon: "flower",
    color: "#9C27B0",
    bgColor: "#F3E5F5",
  },
  {
    id: "3",
    name: "Hydra Facial",
    value: "hydra_facial",
    icon: "droplets",
    color: "#03A9F4",
    bgColor: "#E1F5FE",
  },
  {
    id: "4",
    name: "Pre Bridal",
    value: "pre_bridal",
    icon: "heart",
    color: "#E91E63",
    bgColor: "#FCE4EC",
  },
];

const IconMap: { [key: string]: React.FC<{ className?: string; style?: React.CSSProperties }> } = {
  scissors: Scissors,
  flower: Flower2,
  droplets: Droplets,
  heart: Heart,
};

export default function CategorySection() {
  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="font-display text-2xl md:text-3xl lg:text-4xl font-semibold text-foreground mb-2">
            Popular Categories
          </h2>
          <p className="text-muted-foreground">Choose your beauty service</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category) => {
            const Icon = IconMap[category.icon];
            return (
              <Link
                key={category.id}
                to={`/category/${category.value}`}
                className="group"
              >
                <div
                  className="p-6 md:p-8 rounded-2xl text-center transition-all duration-300 hover:shadow-elevated hover:-translate-y-2"
                  style={{ backgroundColor: category.bgColor }}
                >
                  <div
                    className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 rounded-full bg-card flex items-center justify-center shadow-card group-hover:scale-110 transition-transform duration-300"
                    style={{ boxShadow: `0 8px 24px -8px ${category.color}40` }}
                  >
                    <Icon
                      className="w-8 h-8 md:w-10 md:h-10"
                      style={{ color: category.color }}
                    />
                  </div>
                  <h3 className="font-medium text-sm md:text-base text-foreground">
                    {category.name}
                  </h3>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
