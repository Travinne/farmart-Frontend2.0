import React from "react";

function FAQ() {
  const faqs = [
    {
      question: "How do I create an account?",
      answer: "Click on the Register button on the homepage, fill out your details, and submit the form to create your account."
    },
    {
      question: "How do I list a product for sale?",
      answer: "If you are a farmer, go to the Farmer Dashboard and click on Add Product. Fill in the product details and submit."
    },
    {
      question: "How do I track my order?",
      answer: "Go to your Dashboard, click on Orders, and you can see the status of all your orders."
    },
    {
      question: "What payment methods are accepted?",
      answer: "We accept mobile money, bank transfers, and card payments. Payment options will be visible during checkout."
    },
    {
      question: "How do I reset my password?",
      answer: "On the Login page, click 'Forgot Password' and follow the instructions to reset your password."
    },
    {
      question: "How can I contact customer support?",
      answer: "Use the Contact page to send us a message, and our support team will get back to you as soon as possible."
    }
  ];

  return (
    <div className="faq-page">
      <h1 className="faq-title">Frequently Asked Questions</h1>
      <p className="faq-subtitle">Find answers to common questions about Farmart</p>

      <div className="faq-list">
        {faqs.map((item, index) => (
          <div key={index} className="faq-item">
            <h3 className="faq-question">{item.question}</h3>
            <p className="faq-answer">{item.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FAQ;
