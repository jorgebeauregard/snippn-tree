import Image from 'next/image';
export const dynamic = "force-dynamic";

interface Link {
  id: number;
  title: string;
  url: string;
  description?: string;
}

interface UserData {
  profileImage: string;
  name: string;
  handle: string;
  links: Link[];
}

async function fetchUserData(): Promise<UserData | null> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  try {
    const response = await fetch(`${baseUrl}/api/links`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'plasmagandalla@gmail.com' })
    });

    if (!response.ok) {
      console.error("Failed to fetch user data:", response.statusText);
      return null;
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
}

export default async function Home() {
  const userData: UserData | null = await fetchUserData();

  if (!userData) {
    return <div className="text-white text-center mt-10">Failed to load data. Please try again later.</div>;
  }

  // Sort links alphabetically by title
  const sortedLinks = userData.links ? userData.links.sort((a, b) => a.title.localeCompare(b.title)) : [];
 
  return (
  <div className="flex flex-col items-center h-screen bg-gradient-to-b from-[#c1d1a3] to-[#6e875f] p-4 text-center relative">
      <Image
        src={"https://ugc.production.linktr.ee/q3otGprT72spN626JDrg_IMG_5125.JPG"}
        alt="Profile Picture"
        width={100}
        height={100}
        className="rounded-full mx-auto"
      />
      <h1 className="text-lg sm:text-xl font-bold mt-4 text-white">{userData.name}</h1>
      <p className="text-white">{userData.handle}</p>
      
      <div className="mt-6 space-y-3 w-full max-w-2xl px-8">
        {sortedLinks.map((link) => (
          <a 
            key={link.id} 
            href={link.url} 
          className="block w-full bg-white text-gray-800 px-6 py-3 text-lg rounded-lg border border-gray-300 shadow-md hover:shadow-lg transition-transform transform hover:scale-105 text-center"
          >
            {link.title}
          </a>
        ))}
      </div>
      
      {/* Footer */}
      <footer className="mt-auto pb-2 text-gray-300 text-sm">
        © {new Date().getFullYear()} Snippn.com. All rights reserved.
      </footer>
    </div>
  );
}
