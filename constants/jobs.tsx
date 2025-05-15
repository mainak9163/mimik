import React from "react";

// Job listings data structure for P3CO
export type JobListing = {
  id: string;
  requisitionId: string;
  position: string;
  department: string;
  location: string;
  company: string;
  postedDate: string;
  description: React.ReactNode;
}
const jobListings:JobListing[] = [
    {
      id: "P3CO-ENV-2025-001",
      requisitionId: "REQ-P3CO-05152025-EA",
      position: "Environmental Artist",
      department: "Art",
      location: "Remote",
      company: "P3CO",
      postedDate: "2025-05-15",
      description: (
        <div className="job-description">
          <h2>Environmental Artist</h2>
          <p className="mb-4">
            P3CO is looking for a talented Environmental Artist to join our team working on Astrapuffs — a whimsical, 
            AI-powered cozy sim where emotionally intelligent NPCs form real relationships with players.
          </p>
          
          <h3 className="text-xl font-bold mt-6 mb-2">Responsibilities:</h3>
          <ul className="list-disc pl-6 mb-4">
            <li>Design stylized environments that express the emotional tone of each area</li>
            <li>Create moodboards and world-building references for zones and biomes</li>
            <li>Work closely with 3D, lighting, and game design to ensure coherence and playability</li>
            <li>Develop asset libraries that support our cozy aesthetic while maintaining optimization</li>
            <li>Contribute to the visual storytelling that enhances our agentic NPC interactions</li>
          </ul>
          
          <h3 className="text-xl font-bold mt-6 mb-2">Qualifications:</h3>
          <ul className="list-disc pl-6 mb-4">
            <li>Portfolio demonstrating strong environmental design skills with stylized aesthetics</li>
            <li>Experience with Unity or similar game engines</li>
            <li>Understanding of optimization for mobile-first experiences</li>
            <li>Passion for cozy games and emotional storytelling</li>
            <li>Self-motivated with ability to work remotely</li>
          </ul>
          
          <div className="bg-blue-50 p-4 rounded-lg mt-6">
            <p className="italic">
              This is a pre-seed stage opportunity with potential for stock options as we secure funding. 
              Join us in building one of the first truly agentic cozy multiplayer games!
            </p>
          </div>
        </div>
      )
    },
    {
      id: "P3CO-3DM-2025-002",
      requisitionId: "REQ-P3CO-05152025-3D",
      position: "3D Modeler",
      department: "Art",
      location: "Remote",
      company: "P3CO",
      postedDate: "2025-05-15",
      description: (
        <div className="job-description">
          <h2>3D Modeler</h2>
          <p className="mb-4">
            Help build the charming world of Astrapuffs by creating stylized 3D assets that bring our cozy 
            AI-powered sim to life. As a 3D Modeler at P3CO, you&apos;ll play a crucial role in establishing our 
            game&apos;s visual identity.
          </p>
          
          <h3 className="text-xl font-bold mt-6 mb-2">Responsibilities:</h3>
          <ul className="list-disc pl-6 mb-4">
            <li>Model low-poly and mid-poly assets, props, and characters for our cozy aesthetic</li>
            <li>Optimize assets for mobile-first performance</li>
            <li>Collaborate with animation and environment teams for seamless integration</li>
            <li>Create textures that align with our stylized art direction</li>
            <li>Implement assets within Unity to ensure proper functionality</li>
          </ul>
          
          <h3 className="text-xl font-bold mt-6 mb-2">Qualifications:</h3>
          <ul className="list-disc pl-6 mb-4">
            <li>Portfolio showcasing stylized 3D modeling work</li>
            <li>Proficiency in Blender, Maya, or similar 3D software</li>
            <li>Experience with texturing tools like Substance Painter</li>
            <li>Understanding of optimization techniques for game assets</li>
            <li>Ability to adapt style to match art direction</li>
          </ul>
          
          <div className="bg-blue-50 p-4 rounded-lg mt-6">
            <p className="italic">
              This is an unpaid, short-term opportunity with a path toward becoming part of our core team 
              and earning stock options as we secure funding. You&apos;ll be building something ambitious with 
              a clear, meaningful role and trajectory.
            </p>
          </div>
        </div>
      )
    },
    {
      id: "P3CO-ANIM-2025-003",
      requisitionId: "REQ-P3CO-05152025-AN",
      position: "Animator",
      department: "Art",
      location: "Remote",
      company: "P3CO",
      postedDate: "2025-05-15",
      description: (
        <div className="job-description">
          <h2>Animator</h2>
          <p className="mb-4">
            Join P3CO to bring emotionally intelligent NPCs to life through expressive animation. 
            Your work will be central to our mission of creating meaningful relationships between players 
            and AI-driven characters in our cozy multiplayer game, Astrapuffs.
          </p>
          
          <h3 className="text-xl font-bold mt-6 mb-2">Responsibilities:</h3>
          <ul className="list-disc pl-6 mb-4">
            <li>Animate player characters and agentic NPCs with expressive, readable movement</li>
            <li>Create idle, interaction, and emotional state animations</li>
            <li>Implement animation states in Unity with the dev team</li>
            <li>Develop animation systems that respond to AI-driven emotional states</li>
            <li>Collaborate with the art team to maintain style consistency</li>
          </ul>
          
          <h3 className="text-xl font-bold mt-6 mb-2">Qualifications:</h3>
          <ul className="list-disc pl-6 mb-4">
            <li>Portfolio showcasing character animation skills</li>
            <li>Experience with Unity animation systems</li>
            <li>Understanding of principles of animation</li>
            <li>Ability to convey emotion and personality through movement</li>
            <li>Knowledge of game animation optimization techniques</li>
          </ul>
          
          <div className="bg-blue-50 p-4 rounded-lg mt-6">
            <p className="italic">
              This role offers stock options and competitive compensation once we secure our next funding round.
              Be part of the pioneering team creating the next generation of emotionally intelligent game characters!
            </p>
          </div>
        </div>
      )
    },
    {
      id: "P3CO-AIENG-2025-004",
      requisitionId: "REQ-P3CO-05152025-AI",
      position: "AI Engineer",
      department: "Engineering",
      location: "Remote",
      company: "P3CO",
      postedDate: "2025-05-15",
      description: (
        <div className="job-description">
          <h2>AI Engineer</h2>
          <p className="mb-4">
            As an AI Engineer at P3CO, you&apos;ll be responsible for developing the emotional intelligence systems
            that power our NPCs in Astrapuffs. Your work will create meaningful connections between players and
            AI characters in our cozy multiplayer experience.
          </p>
          
          <h3 className="text-xl font-bold mt-6 mb-2">Responsibilities:</h3>
          <ul className="list-disc pl-6 mb-4">
            <li>Design and implement emotional intelligence systems for game NPCs</li>
            <li>Create memory and relationship models that evolve with player interactions</li>
            <li>Integrate LLM technologies with game systems</li>
            <li>Develop procedural storytelling systems driven by NPC relationships</li>
            <li>Optimize AI systems for runtime performance in Unity</li>
          </ul>
          
          <h3 className="text-xl font-bold mt-6 mb-2">Qualifications:</h3>
          <ul className="list-disc pl-6 mb-4">
            <li>Experience with LLMs and AI agent architectures</li>
            <li>Strong programming skills in C# and Python</li>
            <li>Knowledge of game AI techniques and systems</li>
            <li>Understanding of emotional modeling in artificial agents</li>
            <li>Passion for creating meaningful player-NPC relationships</li>
          </ul>
          
          <div className="bg-blue-50 p-4 rounded-lg mt-6">
            <p className="italic">
              This is a key technical role with competitive compensation and significant equity opportunities.
              You&apos;ll be pioneering new approaches to agentic NPCs in a commercial game environment.
            </p>
          </div>
        </div>
      )
    },
    {
      id: "P3CO-GDSN-2025-005",
      requisitionId: "REQ-P3CO-05152025-GD",
      position: "Game Designer",
      department: "Design",
      location: "Remote",
      company: "P3CO",
      postedDate: "2025-05-15",
      description: (
        <div className="job-description">
          <h2>Game Designer</h2>
          <p className="mb-4">
            P3CO is seeking a creative Game Designer to craft engaging systems and mechanics for Astrapuffs,
            our AI-powered cozy sim. You&apos;ll design interactions that showcase the emotional intelligence of our
            NPCs while creating a delightful player experience.
          </p>
          
          <h3 className="text-xl font-bold mt-6 mb-2">Responsibilities:</h3>
          <ul className="list-disc pl-6 mb-4">
            <li>Design core gameplay loops that highlight NPC agency and relationships</li>
            <li>Create interaction systems between players and AI characters</li>
            <li>Develop progression mechanics that encourage emotional investment</li>
            <li>Balance game economy and resource management systems</li>
            <li>Document and communicate design decisions to the development team</li>
          </ul>
          
          <h3 className="text-xl font-bold mt-6 mb-2">Qualifications:</h3>
          <ul className="list-disc pl-6 mb-4">
            <li>Portfolio showcasing game design work</li>
            <li>Experience with social and relationship mechanics in games</li>
            <li>Understanding of cozy game design principles</li>
            <li>Ability to prototype and iterate rapidly</li>
            <li>Passion for emotionally engaging game experiences</li>
          </ul>
          
          <div className="bg-blue-50 p-4 rounded-lg mt-6">
            <p className="italic">
              Join our innovative team with stock options and competitive compensation once funding is secured.
              Help define a new genre of AI-powered cozy games with meaningful character relationships.
            </p>
          </div>
        </div>
      )
    }
  ];
  
  // // Function to filter job listings based on search criteria
  // const filterJobs = (jobs: JobListing[], searchTerm = "", department = "") => {
  //   return jobs.filter(job => {
  //     const matchesSearch = searchTerm === "" || 
  //       job.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       job.description?.props.children[0].props.children.toLowerCase().includes(searchTerm.toLowerCase());
      
  //     const matchesDepartment = department === "" || 
  //       job.department.toLowerCase() === department.toLowerCase();
      
  //     return matchesSearch && matchesDepartment;
  //   });
  // };
  
  // Function to sort job listings based on criteria
  const sortJobs = (jobs:JobListing[], sortBy = "recent") => {
    switch(sortBy) {
      case "recent":
        return [...jobs].sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime());
      case "alphabetical":
        return [...jobs].sort((a, b) => a.position.localeCompare(b.position));
      default:
        return jobs;
    }
  };
  
  // Get unique departments for filtering
  const getDepartments = (jobs:JobListing[]) => {
    const departments = jobs.map(job => job.department);
    return [...new Set(departments)];
  };
  
  // Create a cleaner object with all job-related functionality
  const allJobs = {
    listings: jobListings,
    // filter: filterJobs,
    sort: sortJobs,
    getDepartments: getDepartments
  };
  
  export default allJobs;