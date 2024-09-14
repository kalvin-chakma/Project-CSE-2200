import React from "react";

const Contact = () => {
  return (
    <div className="flex items-center justify-center h-screen w-screen">
      <div className="flex flex-col lg:flex-row w-[80%] max-w-screen-x overflow-hidden justify-between">
        <div className="lg:w-[50%] p-8">
          <h1 className="text-6xl font-bold mb-6 text-gray-800">Contact Us</h1>
          <p className="text-xl font-semibold mb-4 text-gray-700">
            Technical Address
          </p>
          <p className="text-lg mb-4 text-justify text-gray-600">
            Email : abc@gmail.com
          </p>
          <p className="text-lg mb-4 text-justify text-gray-600">
            You can also contact us via email at{" "}
            <a href="mailto:support@edokan.com" className="text-blue-600">
              support@edokan.com
            </a>{" "}
            or call us at (123) 456-7890. We are available Monday through Friday
            from 9 AM to 5 PM.
          </p>
          <p className="text-lg mb-4 text-justify text-gray-600">
            We look forward to hearing from you and assisting with any inquiries
            you may have.
          </p>
        </div>
        <div className="lg:w-[50%] flex items-center justify-center">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.5395156630416!2d90.40421087562267!3d23.76379498826148!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c790e6cf50a9%3A0xcae56c17297f85f8!2sAhsanullah%20University%20of%20Science%20and%20Technology!5e0!3m2!1sen!2sbd!4v1726306305765!5m2!1sen!2sbd"
            width="400"
            height="300"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default Contact;
