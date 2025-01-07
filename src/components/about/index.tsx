import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Gamepad2, Award, Heart, Users } from 'lucide-react';
import { motion } from "framer-motion";

const AboutPage = () => {
  return (
    <motion.div  
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.2 }} 
    className="max-w-6xl mx-auto px-4 py-12"
    >
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">About Mini Game Center</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Your destination for free online mini-games that bring fun and challenge to your daily breaks!
        </p>
      </div>

      {/* Mission Section */}
      <Card className="mb-12">
        <CardContent className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p className="text-gray-600">
            Mini Game Center is dedicated to providing a collection of free, engaging, and easy-to-play games 
            that anyone can enjoy. Whether you have 5 minutes or an hour, our games are designed to offer 
            instant entertainment while helping you develop various skills like memory, reflexes, and problem-solving abilities.
          </p>
        </CardContent>
      </Card>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="p-6 bg-white rounded-lg shadow-sm border">
          <Gamepad2 className="w-12 h-12 text-blue-500 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Instant Play</h3>
          <p className="text-gray-600">No downloads or installations required - play directly in your browser</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-sm border">
          <Award className="w-12 h-12 text-green-500 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Free Forever</h3>
          <p className="text-gray-600">All our games are completely free to play with no hidden costs</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-sm border">
          <Heart className="w-12 h-12 text-yellow-500 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Family Friendly</h3>
          <p className="text-gray-600">Safe and enjoyable games suitable for players of all ages</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-sm border">
          <Users className="w-12 h-12 text-purple-500 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Growing Collection</h3>
          <p className="text-gray-600">New games added regularly to keep the fun fresh and exciting</p>
        </div>
      </div>

      {/* Game Categories */}
      <Card className="mb-12">
        <CardContent className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Our Games</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Brain Training</h3>
              <ul className="list-disc list-inside text-gray-600">
                <li>Memory Game - Test and improve your memory</li>
                <li>Quick Quiz - Challenge your knowledge</li>
                <li>Match Three - Exercise pattern recognition</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Reflexes & Skills</h3>
              <ul className="list-disc list-inside text-gray-600">
                <li>Whack-a-Mole - Train your reflexes</li>
                <li>Reaction Time - Test your speed</li>
                <li>Typing Speed - Improve your typing</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Section */}
      <Card>
        <CardContent className="p-6 text-center">
          <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
          <p className="text-gray-600 mb-4">
            Have suggestions for new games? Found a bug? We'd love to hear from you!
          </p>
          <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors">
            Contact Us
          </button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AboutPage;
