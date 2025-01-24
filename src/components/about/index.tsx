import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Gamepad2, Award, Heart, Users } from 'lucide-react';
import { motion } from "framer-motion";
import { useTranslation } from 'react-i18next';

const AboutPage = () => {
  const { t } = useTranslation();
  return (
    <motion.div  
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.2 }} 
    className="max-w-6xl mx-auto px-4 py-12"
    >
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">{t('about.title')}</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          {t('about.description')}
        </p>
      </div>

      {/* Mission Section */}
      <Card className="mb-12">
        <CardContent className="p-6">
          <h2 className="text-2xl font-semibold mb-4">{t('about.mission.title')}</h2>
          <p className="text-gray-600">{t('about.mission.description')}</p>
        </CardContent>
      </Card>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="p-6 bg-white rounded-lg shadow-sm border">
          <Gamepad2 className="w-12 h-12 text-blue-500 mb-4" />
          <h3 className="text-lg font-semibold mb-2">{t('about.features.instantPlay.title')}</h3>
          <p className="text-gray-600">{t('about.features.instantPlay.description')}</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-sm border">
          <Award className="w-12 h-12 text-green-500 mb-4" />
          <h3 className="text-lg font-semibold mb-2">{t('about.features.freeForever.title')}</h3>
          <p className="text-gray-600">{t('about.features.freeForever.description')}</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-sm border">
          <Heart className="w-12 h-12 text-yellow-500 mb-4" />
          <h3 className="text-lg font-semibold mb-2">{t('about.features.familyFriendly.title')}</h3>
          <p className="text-gray-600">{t('about.features.familyFriendly.description')}</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-sm border">
          <Users className="w-12 h-12 text-purple-500 mb-4" />
          <h3 className="text-lg font-semibold mb-2">{t('about.features.growingCollection.title')}</h3>
          <p className="text-gray-600">{t('about.features.growingCollection.description')}</p>
        </div>
      </div>

      {/* Game Categories */}
      <Card className="mb-12">
        <CardContent className="p-6">
          <h2 className="text-2xl font-semibold mb-4">{t('about.games.title')}</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">{t('about.games.brainTraining.title')}</h3>
              <ul className="list-disc list-inside text-gray-600">
                <li>{t('about.games.brainTraining.memory')}</li>
                <li>{t('about.games.brainTraining.quiz')}</li>
                <li>{t('about.games.brainTraining.match3')}</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">{t('about.games.reflexes.title')}</h3>
              <ul className="list-disc list-inside text-gray-600">
                <li>{t('about.games.reflexes.whackamole')}</li>
                <li>{t('about.games.reflexes.reaction')}</li>
                <li>{t('about.games.reflexes.typing')}</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Section */}
      <Card>
        <CardContent className="p-6 text-center">
          <h2 className="text-2xl font-semibold mb-4">{t('about.contact.title')}</h2>
          <p className="text-gray-600 mb-4">{t('about.contact.description')}</p>
          <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors">
            {t('about.contact.button')}
          </button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AboutPage;
