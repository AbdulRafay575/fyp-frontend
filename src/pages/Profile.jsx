
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import SummaryViewer from '@/components/SummaryViewer';
import { useToast } from "@/components/ui/use-toast";
import { Camera, Settings, History, User, Key, AtSign } from 'lucide-react';

const Profile = () => {
  const [activeTab, setActiveTab] = useState("settings");
  const { toast } = useToast();

  // Mock user data
  const [userData, setUserData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    profileImage: null
  });

  // Mock summaries for history
  const [summaries, setSummaries] = useState([
    {
      title: "Introduction to Organic Chemistry",
      summary: "This document covers the fundamentals of organic chemistry, including basic principles of carbon compounds, functional groups, and chemical bonding in organic molecules.",
      keyPoints: [
        "Carbon forms four bonds in organic compounds",
        "Functional groups determine chemical properties",
        "IUPAC naming conventions follow specific rules",
        "Stereochemistry addresses 3D arrangement of atoms",
        "Reaction mechanisms show electron movement"
      ]
    },
    {
      title: "Quantum Physics Lecture 3",
      summary: "An exploration of quantum mechanical principles including wave-particle duality, the uncertainty principle, and quantum states.",
      keyPoints: [
        "Wave-particle duality is fundamental to quantum mechanics",
        "Heisenberg's uncertainty principle sets limits on measurement",
        "Quantum states are described by wavefunctions",
        "Schrödinger's equation governs quantum evolution",
        "Quantum entanglement allows for non-local correlations"
      ]
    }
  ]);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated successfully.",
    });
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    toast({
      title: "Password updated",
      description: "Your password has been changed successfully.",
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserData({
          ...userData,
          profileImage: reader.result
        });
        
        toast({
          title: "Profile picture updated",
          description: "Your profile picture has been updated successfully.",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <Navbar />
      <div className="app-container py-8">
        <h1 className="text-3xl font-bold mb-2 gradient-text">User Profile</h1>
        <p className="text-muted-foreground mb-8">Manage your account settings and view your history</p>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid grid-cols-2 max-w-md bg-muted rounded-xl p-1">
            <TabsTrigger value="settings" className="dashboard-tab">
              <Settings className="h-4 w-4" />
              <span className="ml-2">Profile Settings</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="dashboard-tab">
              <History className="h-4 w-4" />
              <span className="ml-2">User History</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="settings" className="space-y-6 animate-fade-in">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="glass-card p-6 rounded-xl col-span-1">
                <div className="flex flex-col items-center">
                  <div className="relative mb-4">
                    <Avatar className="h-28 w-28 border-4 border-primary/20">
                      <AvatarImage src={userData.profileImage} />
                      <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                        {userData.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <label htmlFor="profile-image" className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-2 rounded-full cursor-pointer hover:bg-primary/90 transition-colors">
                      <Camera className="h-4 w-4" />
                      <input 
                        id="profile-image" 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleImageUpload}
                      />
                    </label>
                  </div>
                  <h2 className="text-xl font-semibold">{userData.name}</h2>
                  <p className="text-muted-foreground">{userData.email}</p>
                </div>
              </div>
              
              <div className="glass-card p-6 rounded-xl col-span-2 grid gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <User className="mr-2 h-5 w-5 text-primary" />
                    Personal Information
                  </h3>
                  <form onSubmit={handleSaveProfile} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input 
                        id="name" 
                        value={userData.name} 
                        onChange={(e) => setUserData({...userData, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        value={userData.email} 
                        onChange={(e) => setUserData({...userData, email: e.target.value})}
                      />
                    </div>
                    <Button type="submit">Save Changes</Button>
                  </form>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Key className="mr-2 h-5 w-5 text-primary" />
                    Change Password
                  </h3>
                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input id="current-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input id="new-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <Input id="confirm-password" type="password" />
                    </div>
                    <Button type="submit" variant="outline">Update Password</Button>
                  </form>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="history" className="animate-fade-in">
            <div className="glass-card p-6 rounded-xl">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <AtSign className="mr-2 h-5 w-5 text-primary" />
                My Summaries
              </h3>
              
              <div className="space-y-6">
                {summaries.map((summary, index) => (
                  <SummaryViewer key={index} summary={summary} />
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
