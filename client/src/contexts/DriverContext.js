// import React, { createContext, useState, useEffect } from 'react';
// import config from '../config';

// export const DriverContext = createContext();

// export const DriverProvider = ({ children }) => {
//     // State for driver details
//     const [driver, setDriver] = useState({
//         OfficialNames: '',
//         IDNumber: '',
//         DriverLicenceNumber: '',
//         NumberPlate: '',
//         phoneNumber: '',
//     });

//     // State for contact details (emails, phone numbers, etc.)
//     const [contact, setContact] = useState({
//         email: ['', '', '', ''],
//         phoneNumbers: ['', '', '', ''],
//         faxNumbers: ['', '', '', '']
//     });

//     // Function to update driver details
//     const updateDriverDetails = (updatedDetails) => {
//         setDriver(prevDriver => ({
//             ...prevDriver,
//             ...updatedDetails
//         }));
//     };

//     // Function to update contact details
//     const updateContactDetails = async (updatedContact) => {
//         try {
//             const formattedContact = {
//                 email: (updatedContact.email || []).map(email => email.trim()), // Ensure it's an array
//                 phoneNumbers: (updatedContact.phoneNumbers || []).map(phone => phone.trim()), // Ensure it's an array
//                 faxNumbers: (updatedContact.faxNumbers || []).map(fax => fax.trim()) // Ensure it's an array
//             };

//             const response = await fetch(`${config.backendUrl}/api/contacts/${driver.IDNumber}`, {
//                 method: 'PUT',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(formattedContact),
//             });

//             if (!response.ok) {
//                 throw new Error('Failed to update contact details');
//             }

//             const updatedContactFromServer = await response.json();
//             setContact(updatedContactFromServer);
//         } catch (error) {
//             console.error('Error updating contact:', error);
//         }
//     };

//     // Fetch driver details from localStorage on initial load
//     useEffect(() => {
//         const storedDriver = JSON.parse(localStorage.getItem('driverDetails'));
//         if (storedDriver) {
//             setDriver(storedDriver);
//         }

//         const storedContact = JSON.parse(localStorage.getItem('contactDetails'));
//         if (storedContact) {
//             setContact(storedContact);
//         }
//     }, []);

//     return (
//         <DriverContext.Provider value={{ driver, setDriver, contact, setContact, updateDriverDetails, updateContactDetails }}>
//             {children}
//         </DriverContext.Provider>
//     );
// };
import React, { createContext, useState, useEffect } from 'react';
import config from '../config';

export const DriverContext = createContext();

export const DriverProvider = ({ children }) => {
    // State for driver details
    const [driver, setDriver] = useState({
        OfficialNames: '',
        IDNumber: '',
        DriverLicenceNumber: '',
        NumberPlate: '',
        phoneNumber: '',
        driverImage: '', // Field for driver's image (could be a URL)
        location: '', // Field for location
        vehicleType: '', // Field for type of transport
    });

    // Function to update driver details locally
    const updateDriverDetails = (updatedDetails) => {
        setDriver(prevDriver => ({
            ...prevDriver,
            ...updatedDetails
        }));
    };

    // Function to update driver details on the backend
    const saveDriverDetailsToBackend = async (updatedDetails) => {
        try {
            const response = await fetch(`${config.backendUrl}/api/drivers/${driver.IDNumber}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedDetails),
            });

            if (!response.ok) {
                throw new Error('Failed to update driver details');
            }

            const updatedDriverFromServer = await response.json();
            setDriver(updatedDriverFromServer);
        } catch (error) {
            console.error('Error updating driver details:', error);
        }
    };

    // Function to handle driver image upload
    const uploadDriverImage = async (file) => {
        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await fetch(`${config.backendUrl}/api/drivers/upload-image/${driver.IDNumber}`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Image upload failed');
            }

            const result = await response.json();
            setDriver(prevDriver => ({
                ...prevDriver,
                driverImage: result.imageUrl, // Update the image URL in the context
            }));
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    };

    // Fetch driver details from localStorage on initial load
    useEffect(() => {
        const storedDriver = JSON.parse(localStorage.getItem('driverDetails'));
        if (storedDriver) {
            setDriver(storedDriver);
        }
    }, []);

    // Store updated driver details in localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('driverDetails', JSON.stringify(driver));
    }, [driver]);

    return (
        <DriverContext.Provider value={{ driver, updateDriverDetails, saveDriverDetailsToBackend, uploadDriverImage }}>
            {children}
        </DriverContext.Provider>
    );
};
