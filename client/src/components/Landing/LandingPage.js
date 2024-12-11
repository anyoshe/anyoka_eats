import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../../config';
// import DishCard from '../Menu/DishCard';
import RestaurantCard from '../Menu/RestaurantCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusSquare, faSearch } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import './LandingPage.css';
import OrderTrackingModal from '../Tracking/OrderTrackingModal';
import SearchBar from './SearchBar';
import SpecialOrderModal from '../SpecialOrder/SpecialOrderModal';
// import FoodCard from '../FreshFood/FoodCard';
// import NavBar from '../Header/navbar';
import Testimonials from '../Landing/LandingTestimonial';
import FooterComponent from '../Landing/LandingFooter';
import FoodCardLand from '../FreshFood/FoodCardLand';
import DishCardLand from '../Menu/DishCardLand';
import InstallPrompt from '../Header/InstallPrompt';
// import videoAd from './client/src/assets/images/8477856-hd_1080_1920_24fps.mp4.crdownload';
import AdComponent from './AdComponent';



import foodImg from '../../assets/images/flying-fried-chicken-with-bucket-cartoon.png';
import cateringImg from '../../assets/images/cooking-people-colored-composition.png';
import specialOrderImg from '../../assets/images/abstract-star-burst-with-rays-flare.png';
import conferencingImg from '../../assets/images/people-business-meeting-office-conference-room-concept-teamwork-communication-company-brainstorming-discussion-team-vector-flat-illustration-people-with-speech-bubbles.png';
import trackOrderImg from '../../assets/images/delivery-boy-picks-up-parcel-from-online-store-sending-customer-with-location-application-by-motorcycle-vector-illustration.png';
import freshFoodImg from '../../assets/images/vegetables-concept-illustration.png';
import serviceProviderImg from '../../assets/images/service_Provider.png';
// import userPersonImg from '../../assets/images/userPerson.png';
import deliveryParsonImg from '../../assets/images/deliveryPerason.png';
// import profileImg from '../../assets/images/Eliud.jpg';
// import profileImg2 from '../../assets/images/mzeepassport.JPG';
import videoAd from '../../assets/7218655-hd_1080_1920_25fps.mp4';
import flyer1 from '../../assets/images/fyler1.mp4';
import flyer2 from '../../assets/images/fyler2.mp4';
import flyer3 from '../../assets/images/fyler3.mp4';
import Logo from '../../assets/images/anyokaeats Final Logo.png'

const LandingPage = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [topRatedRestaurants, setTopRatedRestaurants] = useState([]);
    const [dishes, setDishes] = useState([]);
    const [specialOrderModalOpen, setSpecialOrderModalOpen] = useState(false);
    const [discountedFoods, setDiscountedFoods] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [topRatedDishes, setTopRatedDishes] = useState([]);
    const [topRatedFoods, setTopRatedFoods] = useState([]);


    const handleSearch = async () => {
        try {
            const response = await axios.get(`${config.backendUrl}/api/universal-search?q=${searchTerm}`);
            setSearchResults(response.data.results);
        } catch (error) {
            console.error('Error fetching search results:', error);
        }
    };

    useEffect(() => {
        const fetchDiscountedDishes = async () => {
            try {
                const response = await axios.get(`${config.backendUrl}/api/discounted-dishes`);
                const fetchedDishes = response.data.dishes || [];

                const discountedDishes = fetchedDishes.filter(dish => dish.discount && dish.discount > 0).slice(0, 5);

                setDishes(discountedDishes);
            } catch (error) {
                console.error('Error fetching discounted dishes:', error);
            }
        };

        const fetchDiscountedFoods = async () => {
            try {
                const response = await axios.get(`${config.backendUrl}/api/discounts`);
                // console.log("Full response:", response.data); 
                const fetchedFoods = response.data;
                const discountedFoods = fetchedFoods.slice(0, 6);
                setDiscountedFoods(discountedFoods);
            } catch (error) {
                console.error('Error fetching discounted foods:', error);
            }
        };

        fetchDiscountedDishes();
        fetchDiscountedFoods();
    }, []);

    useEffect(() => {
        const fetchTopRatedData = async () => {
            try {
                const response = await axios.get(`${config.backendUrl}/api/dishes-and-restaurants`);
                const restaurants = response.data.restaurants || [];
                const dishes = response.data.dishes || [];

                // Sort and set top-rated restaurants
                const topRatedRestaurants = [...restaurants]
                    .sort((a, b) => b.averageRating - a.averageRating)
                    .slice(0, 6);
                setTopRatedRestaurants(topRatedRestaurants);

                // Sort and set top-rated dishes
                const topRatedDishes = [...dishes]
                    .sort((a, b) => b.averageRating - a.averageRating)
                    .slice(0, 6);
                setTopRatedDishes(topRatedDishes);
            } catch (error) {
                console.error('Error fetching top-rated data:', error);
            }
        };

        fetchTopRatedData();
    }, []);

    useEffect(() => {
        const fetchTopRatedFoods = async () => {
            try {
                const response = await fetch(`${config.backendUrl}/api/foods`);
                const data = await response.json();
                console.log('API Response:', data); // Log the full response for debugging

                if (response.ok && Array.isArray(data)) { // Adjust if the response is directly an array
                    console.log('All Foods:', data); // Log all foods before filtering

                    const sortedTopRatedFoods = data
                        .filter(food => {
                            console.log('Checking food:', food); // Log each food for debugging
                            return food.averageRating !== undefined && !isNaN(food.averageRating);
                        })
                        .sort((a, b) => b.averageRating - a.averageRating)
                        .slice(0, 6);

                    setTopRatedFoods(sortedTopRatedFoods);
                } else {
                    console.error('Invalid response format:', data);
                    setTopRatedFoods([]);
                }

            } catch (error) {
                console.error('Error fetching foods:', error);
                setTopRatedFoods([]);
            }
        };

        fetchTopRatedFoods();

    }, []);


    // Remove the separate getTopRatedDishes function and rely on the useEffect data


    const handleMouseOver = () => {
        setDropdownOpen(true);
    };

    const handleMouseOut = () => {
        setDropdownOpen(false);
    };

    const selectOption = () => {
        setDropdownOpen(false);
    };

    const openModal = () => {
        setIsModalOpen(true)
    };

    const closeModal = () => {
        setIsModalOpen(false)
    };

    const openSpecialOrderModal = () => {
        setSpecialOrderModalOpen(true);
    };

    const closeSpecialOrderModal = () => {
        setSpecialOrderModalOpen(false);
    };

    return (
        <div className="containerDiv">

            <div className="logo-CTA">
                <div className="logoDiv">
                    <h2 className="land_logo">Anyoka Eats</h2>
                </div>

                <div className="signCta_div">
                    {/* <Link to="/sign-up-sign-in" className="landing_sign">Log In</Link> */}
                    {/* <img src={Logo} alt="Anyoka Eats Logo" className="land_logo" /> */}
                </div>
            </div>
            <section className="headerSection">

                {/* searchBar & services */}
                <div className="services-serchBar">
                    <SearchBar /><InstallPrompt />


                    {/* welcome message/slogan */}
                    <div className="services_slogan">
                        <div className="slogan">
                            <p className="sloganParagraph">Best services at your own comfort</p>
                        </div>

                        {/* services offered */}
                        <div className="services">
                            {/* Food */}
                            <Link to="/menu">
                                <div id="foodService" className="serviceDiv">
                                    <img src={foodImg} alt="Food" className="serviceImg" />
                                    {/* <p>Food</p> */}
                                    <p>Ready Meals</p>
                                </div>
                            </Link>

                            {/* Outside Catering */}
                            {/* <Link to={'/outside-catering'}> */}
                            <div id="disabled" className="serviceDiv">
                                <img src={cateringImg} alt="Outside Catering" className="serviceImg" />
                                <p>Outside Catering</p>
                            </div>
                            {/* </Link> */}

                            {/* Special Order */}
                            <div id="specialOrderService" className="serviceDiv">
                                <img src={specialOrderImg} alt="Special Order" className="serviceImg" onClick={openSpecialOrderModal} />
                                <p>Special Order</p>
                            </div>

                            {/* More */}
                            {/* <Link to={'/user'}> */}
                            <div id="moreServices" className="serviceDiv">
                                <FontAwesomeIcon icon={faPlusSquare} className="faIcons fa-7x more_icon" />
                                <p>More</p>
                            </div>
                            {/* </Link> */}

                            {/* Conferencing & Meeting */}
                            {/* <Link to={'/conferences'}> */}
                            <div id="disabled" className="serviceDiv">
                                <img src={conferencingImg} alt="Conferencing & Meeting" className="serviceImg" />
                                <p id='longConference'>Conference & Meeting</p>
                            </div>
                            {/* </Link> */}

                            {/* Track Your Order */}

                            <div id="trackOrder" className="serviceDiv" onClick={openModal}>
                                <img src={trackOrderImg} alt="Track Your Order" className="serviceImg" />
                                {/* <p>Track Your Order</p> */}
                                <p>Track Order</p>
                            </div>

                            {/* Fresh Foods */}
                            <Link to={'freshfood'}>
                                <div id="freshFoodService" className="serviceDiv">
                                    <img src={freshFoodImg} alt="Fresh Foods" className="serviceImg" />
                                    <p>Groceries</p>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* offers section */}
            <section className="offersSection">
                {/* offer title and offer search bar */}
                <div className="title-offerSearch">
                    <div className="title">
                        <h2 className='offerTitle'>What's New</h2>
                    </div>
                </div>

                <div className="category-dispaly">
                    {/* offer categories */}
                    <div className="offerNavContainer">
                        <div className="offerNav">
                            {/* <button className="categories allBtn">All</button> */}

                            <button className="categories categoryBtn" onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
                                Categories
                            </button>

                            {/* {dropdownOpen && (
                                <div className="dropdown-content" onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
                                    <a href="#Food" onClick={selectOption}>Food</a>
                                    <a href="#Special_Orders" onClick={selectOption}>Special Orders</a>
                                    <a href="#Outside_Catering" onClick={selectOption}>Outside Catering</a>
                                    <a href="#Conferencing_&_Meeting" onClick={selectOption}>Conferencing & Meeting</a>
                                    <a href="#Fresh_Foods" onClick={selectOption}>Fresh Foods</a>
                                </div>
                            )} */}
                        </div>

                        <div className="search-container">
                            <input
                                type="text"
                                name="search"
                                placeholder="Search for any offer!!!"
                                className="search-input"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        handleSearch();
                                    }
                                }}
                            />
                            <a href="#" className="search-btn" onClick={handleSearch}>
                                <FontAwesomeIcon icon={faSearch} />
                            </a>


                            {/* Display Search Results */}
                            {searchResults.length > 0 && (
                                <div className="search-results">
                                    {searchResults.map((result, index) => (
                                        <div key={index} className="search-result-item">
                                            <a href={`/${result.type}/${result.dishCode}`} className="search-result-item-a">
                                                {result.dishName && result.restaurant}
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="offers-container">
                        {/* offer display */}

                        {dishes.length > 0 ? (
                            <div>
                                <div className="offerDisplay">
                                    {dishes.map(dish => (
                                        <DishCardLand key={dish.dishCode} dish={dish} source="offers" />
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="ads-container">


                                <AdComponent
                                    type="flyer"
                                    content={flyer2}
                                    altText="Flyer for special offers"
                                    link="/menu"
                                // heading="Special Offers Just for You!"
                                // description="Check out the best offers on your favorite dishes."
                                />
                                {/* Alternatively, you could use video ads */}

                                <AdComponent
                                    type="video"
                                    content="https://youtu.be/Tn6e94ODPCI?si=kNQgzPEKX6uvji94"
                                    // content={flyer1}
                                    link="/"

                                // heading="Exclusive Discount Video"
                                // description="Watch the video to discover amazing!"
                                />
                                <AdComponent
                                    type="flyer"
                                    content={flyer3}
                                    altText="Flyer for special offers"
                                    link="/freshfood"
                                // heading="Special Offers Just for You!"
                                // description="Check out the best offers on your favorite dishes."
                                />

                            </div>
                        )}

                        {/* Discounted Foods */}
                        {discountedFoods.length > 0 ? (
                            <div>
                                <div className="offerDisplay">
                                    {discountedFoods.map(food => (
                                        <FoodCardLand key={food.foodCode} food={food} />
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div>
                                <h2>Foods to Check Out</h2>
                                <div className="offerDisplay">
                                    {topRatedFoods.map((food) => (
                                        <FoodCardLand key={food.foodCode} food={food} />
                                    ))}
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </section>

            {/* featured section */}
            <section className="featuredSection">
                <div className='divHotel divFeatured'>
                    {/* hotels heading */}
                    <div className="FeaturedDiv">
                        <h2 className="FeaturedHeading">Featured Hotels</h2>
                    </div>

                    <div className="DishCards">
                        {topRatedRestaurants && topRatedRestaurants.length > 0 ? (
                            topRatedRestaurants.map((restaurant, index) => (
                                <RestaurantCard key={index} restaurant={restaurant} />
                            ))
                        ) : (
                            <p>No featured hotels available at the moment. Keep checking for the updates</p>
                        )}
                    </div>

                </div>

                <div className='divFood divFeatured'>
                    {/* Food heading */}
                    <div className="FeaturedDiv">
                        <h2 className="FeaturedHeading">Featured Food</h2>
                    </div>

                    {/* Food features */}
                    <div className="featuredFood featured">
                        {topRatedDishes.length > 0 ? (
                            topRatedDishes.map(dish => (
                                <DishCardLand key={dish.dishCode} dish={dish} source="featured" />
                            ))
                        ) : (
                            <p>No featured dishes available at the moment. Please check back later.</p>
                        )}
                    </div>


                </div>
            </section>

            <section className="join_team_section">
                <div className="join_team_div">
                    {/* <!-- PARAGRAPH  DIV --> */}
                    <div className="paragraph_div">
                        <h3 className="join_team_heading">
                            Join our ever evolving and  growing community as :
                        </h3>
                    </div>

                    {/* <!-- JOIN TEAM GRID CHOICES --> */}
                    <div className="join_team_grid_div">
                        <div className="join_team_choices">
                            <h3 className="join_title">Service Provider</h3>

                            <p className="join_explanation">Register your hotel, catering  or fresh food bussiness offer services</p>

                            {/* <!-- IMAGE DIV AND IMAGE --> */}
                            <div className="join_team_image_div">
                                <img src={serviceProviderImg} alt="Service Provider" className="join_img" />
                            </div>

                            {/* <!-- SIGN UP BUTTON --> */}
                            <Link to="/sign-up-sign-in" >
                                <button className="signup">Sign Up</button>
                            </Link>
                        </div>

                        <div className="join_team_choices" id='video-Ad'>
                            <iframe
                                src={videoAd}
                                type="video/mp4"
                                autoPlay
                                loop
                                muted
                                playsInline
                                id='video-Ad-video'
                            />
                        </div>

                        <div className="join_team_choices">
                            <h3 className="join_title">Deliver Person</h3>

                            <p className="join_explanation">Do you have a job.Fulfill delivery orders for customers and earn per trip</p>

                            <div className="join_team_image_div">
                                <img src={deliveryParsonImg} alt="Delivery Person" className="join_img" />

                            </div>

                            <Link to="/driverCreateAccount" >
                                <button className="signup" >Sign Up/In</button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
            {/* <!-- ABOUT US PAGE  --> */}
            <section className="about_us_section">
                <div className="about_us_div">
                    <div className="about_title_div">
                        <h3 className="about_us_title">About Us</h3>
                    </div>

                    <div className="about_us_content">
                        <p className="aboutUs_paragraph">At Anyoka Eats, our mission is to transform the dining experience with a seamless, innovative online restaurant platform. Founded by a passionate team dedicated to enhancing food discovery and ordering, we combine cutting-edge technology with a love for great food.

                            Our platform brings together a diverse range of restaurants and cuisines, allowing users to effortlessly browse, order, and enjoy their favorite dishes. With features like real-time order tracking, personalized recommendations, and a user-friendly interface, we strive to make every meal memorable.

                            In addition to exceptional dining options, Anyoka Eats offers a variety of services to cater to your unique needs. Explore our conference and meeting spaces, perfect for business gatherings and special events. With detailed information on venue capacity, location, and available services, planning your next event has never been easier.

                            Our special ordering feature allows you to request customized meals that are made to your specific preferences, ensuring a home-cooked feel with every bite. We also offer a selection of fresh foods, delivered hot and ready to enjoy, to elevate your dining experience.

                            Our team, composed of experts in web development, user experience design, and culinary arts, works tirelessly to ensure that our platform not only meets but exceeds customer expectations. From dynamic dish updates to intuitive search functionalities, we are committed to providing an exceptional online dining experience.

                            Join us on this culinary journey and discover how Anyoka Eats is redefining the future of dining, events, and personalized food experiences.
                        </p>
                    </div>

                </div>
            </section>

            <Testimonials />
            <FooterComponent />

            <OrderTrackingModal isOpen={isModalOpen} onClose={closeModal} />
            {specialOrderModalOpen && <SpecialOrderModal closeModal={closeSpecialOrderModal} />}
        </div>
    );
};

export default LandingPage;