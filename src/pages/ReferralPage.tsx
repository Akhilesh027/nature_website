import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Gift,
  Copy,
  Share2,
  Users,
  Coins,
  ChevronLeft,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";

export default function ReferralPage() {
  const [referralCode] = useState("GLAMOUR" + Math.random().toString(36).substring(2, 8).toUpperCase());
  const [copied, setCopied] = useState(false);

  // Mock data - in real app, fetch from API
  const referralData = {
    totalReferrals: 5,
    successfulReferrals: 3,
    coinsEarned: 375,
    pendingCoins: 250,
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralCode);
      setCopied(true);
      toast.success("Referral code copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const handleShare = async () => {
    const message = `Hey! Use my referral code ${referralCode} on Glamour Beauty to get 125 coins when you sign up!`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Glamour Beauty Referral",
          text: message,
        });
      } catch {
        // User cancelled or share failed
      }
    } else {
      await navigator.clipboard.writeText(message);
      toast.success("Referral message copied!");
    }
  };

  const steps = [
    {
      icon: Share2,
      title: "Share Your Code",
      description: "Share your unique referral code with friends and family",
    },
    {
      icon: Users,
      title: "Friends Sign Up",
      description: "Your friends create an account using your referral code",
    },
    {
      icon: Coins,
      title: "Both Earn Rewards",
      description: "You both get 125 coins when they complete their first booking",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <div className="gradient-hero pt-8 pb-20">
        <div className="container mx-auto px-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground mb-4 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Home
          </Link>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-full bg-primary-foreground/20 flex items-center justify-center">
              <Gift className="w-7 h-7 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground">
                Refer & Earn
              </h1>
              <p className="text-primary-foreground/80">
                Share the love, earn rewards
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-12">
        {/* Referral Code Card */}
        <div className="bg-card rounded-2xl shadow-elevated p-6 md:p-8 mb-8">
          <h2 className="font-display text-xl font-semibold text-foreground mb-4">
            Your Referral Code
          </h2>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Input
                  value={referralCode}
                  readOnly
                  className="text-center text-lg font-mono font-bold tracking-widest h-14 pr-12"
                />
                <button
                  onClick={handleCopy}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                >
                  {copied ? (
                    <CheckCircle className="w-5 h-5 text-primary" />
                  ) : (
                    <Copy className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
            <Button onClick={handleShare} size="lg" className="rounded-xl">
              <Share2 className="w-5 h-5 mr-2" />
              Share Code
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card rounded-xl p-4 shadow-card">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm text-muted-foreground">Total Referrals</span>
            </div>
            <span className="text-2xl font-bold text-foreground">
              {referralData.totalReferrals}
            </span>
          </div>

          <div className="bg-card rounded-xl p-4 shadow-card">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm text-muted-foreground">Successful</span>
            </div>
            <span className="text-2xl font-bold text-foreground">
              {referralData.successfulReferrals}
            </span>
          </div>

          <div className="bg-card rounded-xl p-4 shadow-card">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
                <Coins className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-sm text-muted-foreground">Coins Earned</span>
            </div>
            <span className="text-2xl font-bold text-primary">
              {referralData.coinsEarned}
            </span>
          </div>

          <div className="bg-card rounded-xl p-4 shadow-card">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                <Coins className="w-5 h-5 text-accent" />
              </div>
              <span className="text-sm text-muted-foreground">Pending</span>
            </div>
            <span className="text-2xl font-bold text-foreground">
              {referralData.pendingCoins}
            </span>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-card rounded-2xl shadow-card p-6 md:p-8 mb-8">
          <h2 className="font-display text-xl font-semibold text-foreground mb-6">
            How It Works
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {steps.map((step, idx) => (
              <div key={idx} className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center mb-4">
                    <step.icon className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </div>
                {idx < steps.length - 1 && (
                  <ArrowRight className="hidden md:block absolute top-8 -right-3 w-6 h-6 text-muted-foreground/30" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="gradient-hero rounded-2xl p-8 text-center mb-8">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-primary-foreground mb-4">
            Start Earning Today!
          </h2>
          <p className="text-primary-foreground/80 mb-6 max-w-md mx-auto">
            Share your referral code now and earn 125 coins for every successful referral.
          </p>
          <Button
            onClick={handleShare}
            variant="secondary"
            size="lg"
            className="rounded-full"
          >
            <Share2 className="w-5 h-5 mr-2" />
            Share Your Code
          </Button>
        </div>
      </div>
    </div>
  );
}
