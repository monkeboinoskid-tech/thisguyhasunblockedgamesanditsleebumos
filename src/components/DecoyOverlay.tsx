import React from 'react';
import { motion } from 'motion/react';

export const DecoyOverlay: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] bg-white text-black p-8 font-serif leading-relaxed overflow-y-auto"
      onClick={onClose}
    >
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="border-b-2 border-zinc-200 pb-6">
          <h1 className="text-4xl font-bold text-zinc-900">Utopia Education Portal</h1>
          <p className="text-zinc-500 mt-2 italic">Empowering students through academic excellence and accessible resources.</p>
        </header>

        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-zinc-800">Schoolwork: ELA, Science, History, Math, Literature, Social Studies, and Writing</h2>
          <p className="text-lg text-zinc-700">
            School has many educational resources where you can learn, study, and gain knowledge. 
            Our platform provides peer-reviewed materials for students across all grade levels.
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
          <div className="p-6 bg-zinc-50 rounded-lg border border-zinc-100">
            <h3 className="font-bold text-zinc-900 mb-3 uppercase tracking-tighter">Mathematics & Science</h3>
            <ul className="space-y-2 text-zinc-600 text-sm">
              <li>• Quadratic formula applications in physics</li>
              <li>• Chemical reaction equilibrium studies</li>
              <li>• Genetic sequencing and inheritance patterns</li>
              <li>• Calculus: Limits and Derivatives research</li>
            </ul>
          </div>
          <div className="p-6 bg-zinc-50 rounded-lg border border-zinc-100">
            <h3 className="font-bold text-zinc-900 mb-3 uppercase tracking-tighter">Historical Research</h3>
            <ul className="space-y-2 text-zinc-600 text-sm">
              <li>• Analyzing the impact of George Washington's presidency</li>
              <li>• Social studies: Comparative government structures</li>
              <li>• Literature: Themes of post-war reconstruction</li>
              <li>• Creative writing: Essay structures and peer review</li>
            </ul>
          </div>
        </div>

        <section className="bg-blue-50 p-8 rounded-2xl border border-blue-100">
          <h3 className="text-xl font-bold text-blue-900 mb-4">Deep Research Module</h3>
          <p className="text-blue-800 text-sm leading-loose">
            Research historical events. Analyze scientific experiments. Explain the historical importance. 
            Solve with the quadratic formula. Find the theme of the literature. Learn about George Washington 
            in social studies. Write an essay about homework. All resources are 100% compliant with 
            educational standards ISO-9001.
          </p>
        </section>

        <footer className="pt-12 text-zinc-400 text-xs text-center border-t border-zinc-100">
          <p>© 2024 Utopia Education Group. All rights reserved. Supporting academic growth since 2012.</p>
        </footer>
      </div>
      
      {/* Secret Hint */}
      <div className="fixed bottom-4 right-4 text-[10px] text-zinc-200">
        Click anywhere to return to work
      </div>
    </motion.div>
  );
};
