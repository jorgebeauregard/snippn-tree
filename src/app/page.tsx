import Image from 'next/image';
import { notFound } from 'next/navigation';

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

async function fetchUserData(username: string): Promise<UserData | null> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  try {
    const response = await fetch(`${baseUrl}/api/links`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username })
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

  const userData: UserData | null = await fetchUserData("plasmagandalla");

  if (!userData) {
    return notFound(); // Show 404 if user is not found
  }


  // Sort links alphabetically by title
  const sortedLinks = userData.links ? userData.links.sort((a, b) => a.title.localeCompare(b.title)) : [];
 
  return (
  <div className="flex flex-col items-center h-screen bg-gradient-to-b from-[#c1d1a3] to-[#6e875f] p-4 text-center relative">
      <Image
        src={"https://mobiusforms.blob.core.windows.net/forms-images/profile2.jpg"}
        alt="Profile Picture"
        width={100}
        height={100}
        className="rounded-full mx-auto"
      />
      <h1 className="text-lg sm:text-xl font-bold mt-4 text-white">{userData.handle}</h1>
      <p className="text-white">Bibian Alessia ~ Art and Tattoos 🎨✨</p>
      
      <div className="mt-8 space-y-3 w-full max-w-2xl px-8">
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
        snippn | beauregard | {new Date().getFullYear()}
      </footer>
    </div>
  );
}
