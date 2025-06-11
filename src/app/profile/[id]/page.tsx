'use client';
import React, { use, useState, useEffect } from "react";
import axios from 'axios';
import toast from 'react-hot-toast'
import { useRouter } from "next/navigation";


type User = {
  _id: string;
  username: string;
  email: string;
  // Add other fields as needed
};

type Props = {
  params: {
    id: string;
  };
};

export default function UserProfile({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const router = useRouter()


  const logout = async ()=>{
    try{
      const logoutResponse = await axios.get("/api/users/logout")
      toast.success("Logout Successful!!")
      router.push("/login")
    } catch(error: any) {
      toast.error(error.message)
    }
    

  }

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axios.get(`/api/users/${id}`);
        setUser(response.data.user);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch user');
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, [id]);

  if (loading) return <p>Loading user...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

  return (
    <div>
      <h1>User Profile</h1>
      <p><strong>ID:</strong> {user?._id}</p>
      <p><strong>Name:</strong> {user?.username}</p>
      <p><strong>Email:</strong> {user?.email}</p>
      <div className="form-row-inner">
        <button onClick={()=>{logout()}} className="form-submit-button form-submit-button-logout">Logout</button>    
      </div>
    </div>
  );
}
