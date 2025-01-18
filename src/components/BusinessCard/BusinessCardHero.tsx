import React from 'react';
import { motion } from 'framer-motion';

export function BusinessCardHero() {
  return (
    <section className="pt-32 pb-12 bg-gradient-to-br from-[#fff5f0] to-white relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      <div className="container mx-auto px-4">
        <div className="max-w-lg mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-32 h-32 mx-auto mb-8 rounded-full overflow-hidden border-4 border-white shadow-lg">
              <img 
                src="https://media.licdn.com/dms/image/v2/D4E03AQFW_0JZVVU9CQ/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1694447144248?e=1742428800&v=beta&t=LHcaQGrZzBka6RVGrqaJXnLf_oT8qkOXZiT5Fk4qKUE"
                alt="Tim Tielkemeijer"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "https://ui-avatars.com/api/?name=Tim+Tielkemeijer&background=e96020&color=fff&size=200";
                }}
              />
            </div>
            <h1 className="text-4xl font-bold mb-4 font-rubik">
              Tim Tielkemeijer
            </h1>
            <p className="text-xl text-gray-600 mb-2">
              AI & Automation Expert
            </p>
            <p className="text-gray-500">
              Tielo Digital
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}