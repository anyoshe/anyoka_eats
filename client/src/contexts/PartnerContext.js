import React, { createContext, useState, useEffect } from 'react';
import config from '../config';

export const PartnerContext = createContext();

export const PartnerProvider = ({ children }) => {
    const [partner, setPartner] = useState({
        businessName: '',
        businessType: '',
        contactNumber: '',
        email: '',
        location: '',
        userName: '',
    });
    const [contact, setContact] = useState({
        email: ['', '', '', ''],
        phoneNumbers: ['', '', '', ''],
        faxNumbers: ['', '', '', '']
    });

    const updatePartnerDetails = (updatedDetails) => {
        setPartner(prevPartner => ({
            ...prevPartner,
            ...updatedDetails
        }));
    };
    const updateContactDetails = async (updatedContact) => {
        try {
            const formattedContact = {
                email: (updatedContact.email || []).map(email => email.trim()),           // Ensure it's an array
                phoneNumbers: (updatedContact.phoneNumbers || []).map(phone => phone.trim()), // Ensure it's an array
                faxNumbers: (updatedContact.faxNumbers || []).map(fax => fax.trim())        // Ensure it's an array
            };
    
            const response = await fetch(`${config.backendUrl}/api/contacts/${partner._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formattedContact),
            });
    
            if (!response.ok) {
                throw new Error('Failed to update contact details');
            }
    
            const updatedContactFromServer = await response.json();
            setContact(updatedContactFromServer);
        } catch (error) {
            console.error('Error updating contact:', error);
        }
    };
    
    
    useEffect(() => {
        const storedPartner = JSON.parse(localStorage.getItem('partnerDetails'));
        if (storedPartner) {
          setPartner(storedPartner);
        }
        const storedContact = JSON.parse(localStorage.getItem('contactDetails'));
        if (storedContact) {
          setContact(storedContact);
        }
    }, []);

    return (
        <PartnerContext.Provider value={{ partner, setPartner, contact, setContact, updatePartnerDetails, updateContactDetails }}>
            {children}
        </PartnerContext.Provider>
    );
};
