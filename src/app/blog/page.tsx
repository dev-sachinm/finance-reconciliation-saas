"use client";

import { useSession, signOut as nextAuthSignOut, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";


const BlogPage = () => {
    const { data: session, status } = useSession();
    const router = useRouter();

    console.log("Session:", session);
    console.log("Status:", status);

    useEffect(() => {
        if (status === "loading") {
            return;
        }

        if (status === "unauthenticated") {
            const currentPath = window.location.pathname + window.location.search;
            signIn(undefined, { callbackUrl: encodeURIComponent(currentPath) });
            return;
        }
    }, [status, router]);

    if (status === "loading") {
        return (
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <p>Loading session status...</p>
                <p>Please wait or you will be redirected to the sign-in page.</p>
            </div>
        );
    }

    if (status === "authenticated") {
        return (
            <div style={{ padding: '20px', maxWidth: '600px', margin: '50px auto', border: '1px solid #e0e0e0', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <h1 style={{ color: '#333', marginBottom: '15px' }}>Blog Page (Protected Content)</h1>
                <p style={{ fontSize: '1.1em', marginBottom: '10px' }}>Signed in as <span style={{ fontWeight: 'bold', color: '#007bff' }}>{session.user?.email}</span></p>
                {session.user?.name && <p style={{ fontSize: '1.1em', marginBottom: '10px' }}>User Name: <span style={{ fontWeight: 'bold' }}>{session.user.name}</span></p>}
                {session.user?.username && <p style={{ fontSize: '1.1em', marginBottom: '20px' }}>User: <span style={{ fontWeight: 'bold' }}>{session.user.username}</span> is logged in</p>}
                
                <button
                    onClick={() => nextAuthSignOut({ callbackUrl: '/sign-in' })}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '1em',
                        transition: 'background-color 0.3s ease'
                    }}
                >
                    Sign out
                </button>
                <div style={{ marginTop: '30px', borderTop: '1px dashed #ccc', paddingTop: '20px' }}>
                    <h2 style={{ color: '#555', marginBottom: '10px' }}>Session Details (for debugging):</h2>
                    <pre style={{ backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '5px', overflowX: 'auto', fontSize: '0.9em' }}>
                        {JSON.stringify(session, null, 2)}
                    </pre>
                </div>
            </div>
        );
    }

    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <p>You are not signed in. Redirecting to sign-in page...</p>
        </div>
    );
};

export default BlogPage;