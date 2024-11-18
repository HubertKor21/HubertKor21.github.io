import { useEffect, useState } from 'react';
import api from '../../api';

interface FamilyMember {
    email: string;
    first_name: string | null;
    last_name: string | null;
}

interface FamilyData {
    member_count: number;
    members: FamilyMember[];
    family_name: string;
}

function SettingTable() {
    const [familyName, setFamilyName] = useState('');
    const [email, setEmail] = useState('');
    const [familyData, setFamilyData] = useState<FamilyData | null>(null);
    const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);

    useEffect(() => {
        // Fetch family members when the component loads
        const fetchFamilyMembers = async () => {
            try {
                const response = await api.get('/api/families/members/');
                setFamilyData(response.data); // Assuming the API returns member_count and members
                setFamilyMembers(response.data.members); // Set the members array
                console.log(response.data);
            } catch (error) {
                console.log("Error fetching family members", error);
            }
        };
        fetchFamilyMembers();
    }, []);

    useEffect(() => {
        // Fetch or create family on email/familyName change
        const fetchOrCreateFamily = async () => {
            if (email && familyName) {
                try {
                    const response = await api.post('/api/v1/invite/', {
                        email: email,
                        family_name: familyName,
                    });
                    setFamilyData(response.data); // Assuming the API returns the family data
                    setFamilyMembers(response.data.members); // Update family members
                    console.log(response.data);
                } catch (error) {
                    console.log("Error inviting user to family", error);
                }
            }
        };

        // Trigger API call only when both email and family name are set
        if (email && familyName) {
            fetchOrCreateFamily();
        }
    }, [email]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email && familyName) {
            // Call the API when the form is submitted
            api.post('/api/v1/invite/', {
                email,
                family_name: familyName,
            })
            .then(response => {
                setFamilyData(response.data); // Set the response to familyData
                setFamilyMembers(response.data.members); // Update family members
                console.log(response.data);
            })
            .catch(error => console.error("Error:", error));
        }
    };

    return (
        <div className="md:w-[95%] w-[80%] bg-white shadow-sm rounded-xl mt-10 px-5 py-4 mb-8">
            <div className="flex w-full items-center justify-between mb-6">
                <div className='md:w-[45%] w-[80%] bg-white shadow-sm rounded-xl mt-10 px-5 py-4 mb-8'>
                    <h2 className="text-lg font-semibold mb-4">Ustawienia</h2>
                    <h3 className="text-md font-medium">Tu bedzie nazwa rodziny</h3>
                    <p className="text-sm mt-2">{familyData?.family_name || "Tu będzie nazwa rodziny"}</p>
                    <div className="mt-4 flex gap-2">
                        <button className="bg-gray-600 text-white px-4 py-2 rounded-md">Eksport</button>
                        <button className="bg-red-400 text-white px-4 py-2 rounded-md">Zacznij od nowa</button>
                    </div>
                    <h3 className="text-md font-medium mt-6">Dostęp do budżetu</h3>
                    <p className="text-sm mt-2">Email</p>
                    <form onSubmit={handleSubmit}>
                        <div className='flex gap-2'>
                            <input 
                                className='rounded-xl shadow-sm bg-slate-100 mt-2'
                                type="email" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Wprowadź email"
                                required
                            />
                            <input 
                                className='rounded-xl shadow-sm bg-slate-100 mt-2'
                                type="text" 
                                value={familyName} 
                                onChange={(e) => setFamilyName(e.target.value)}
                                placeholder="Wprowadź nazwę rodziny"
                                required
                            />
                            <button type="submit" className='ml-2 px-3 rounded-xl shadow-sm bg-green-600 text-black'>
                                <p>Wyślij</p>
                            </button>
                        </div>
                    </form>
                    <h3 className="text-md font-medium mt-6">Członkowie rodziny:</h3>
                    <p className="text-sm mt-2 text-gray-400">
                        {familyMembers ? (
                            familyMembers.map((member, index) => (
                                <span key={index}>
                                    {member.first_name && member.last_name 
                                        ? `${member.first_name} ${member.last_name} - ${member.email}` 
                                        : `${member.email}`}
                                    <br />
                                </span>
                            ))
                        ) : (
                            <span>Brak członków rodziny</span>
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default SettingTable;
