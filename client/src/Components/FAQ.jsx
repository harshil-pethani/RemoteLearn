import React from 'react'
import faqBgFont from "../Assets/faqBgFont.png";
import { Link } from "react-router-dom";

const FAQ = () => {
    const faqQuestions = [
        {
            que: "I had taken a drop from study in past, can I still Enroll?",
            ans: "Absolutely. At Remote Learn we do our best so that everyone can learn easily. Please reach out directly to our Founder, YouYOGENDRA SINGH, if you have any questions or concerns."
        },
        {
            que: "I’ve never done coding, will I be able to do this?",
            ans: "Absolutely. We have built Remote Learn to be appropriate and accessible for everyone. Whether you are one of our professional Coder or someone who has never Coded before, we have a plan for you! Take the quiz above and than we will contact you for free consultant"
        },
        {
            que: "What are the things that should I have?",
            ans: "At Remote Learn, we believe that you must have one Laptop or personal Computer so that you can attend session as well as do works or coding practices which we providing in the session."
        },
        {
            que: "I’m a married woman, can I still learn any course?",
            ans: "Yes!, We should never stop learning. As the ONE+ tagline says never settle. Do start it anytiime and you are gonna love it fullest. Its really amazing to be a coder. You can make your ideas really come into real life."
        },
        {
            que: "What if I miss a session?",
            ans: "At Remote Learn we want to promote accountability and consistency. We also know that life happens. We are very flexible with options if you miss a session. Connect with your teacher or the Founder, Yogendra Singh, in order to make up revision for that session."
        },
        {
            que: "Do you offer free trials?",
            ans: "Yes, we do have free trials. We periodically do free classes on weekends. Feel free to sign up from Free Class button in Navbar.",
        },
        {
            que: "Can I get a refund?",
            ans: "At Remote Learn we do our best to accommodate our partners. Generally speaking, we don’t offer refunds but if some unforeseen circumstances arise contact our founder, Yogendra Singh, he will be able to help you."
        },
        {
            que: "Do you offer corporate partnerships?",
            ans: "Yes, we do! We love working with large groups of motivated people. We offer completely customizable packages for groups."
        },
        {
            que: "None of the available times work for me but I’d love to learn from Remote Learn, do you take Batch recommendations?",
            ans: "Absolutely. As we grow we hope to have all classes available throughout the day. Until then, please feel free to recommend Batch by emailing us at admin@remotelearn.org"
        },
        {
            que: "Can I break up payments and pay on a weekly or daily basis?",
            ans: "Yes, you can. Everyone’s budget is different. Sometimes it’s not easy to pay upfront for our services. At Remote Learn we strive to make budgeting accessible. We do have weekly payment structures. Reach out to our Founder, Yogendra Singh to learn more."
        }
    ]

    return (
        <div className="faqSection">
            <h1 className="title">
                Frequently Asked Questions
            </h1>

            <div className="questionsContainer">
                {
                    faqQuestions.map((faqQuestion, index) => {
                        return (
                            <details key={index}>
                                <summary>
                                    <p className="que">
                                        {faqQuestion.que}
                                    </p>
                                    <p className="btn">
                                        +
                                    </p>
                                </summary>
                                <p className="ans">
                                    {faqQuestion.ans}
                                    {
                                        faqQuestion.url &&
                                        <a target="_blank" rel="noreferrer" href={faqQuestion.url}>
                                            {faqQuestion.urltext}
                                        </a>
                                    }
                                    {
                                        faqQuestion.link &&
                                        <Link to={faqQuestion.link} style={{ margin: "0" }}>
                                            {faqQuestion.linktext}
                                        </Link>
                                    }
                                    {faqQuestion.ans2}
                                </p>
                            </details>
                        )
                    })
                }
            </div >
            <div className="faqBgFont">
                <img loading="lazy" src={faqBgFont} alt="" />
            </div>
        </div>
    )
}

export default FAQ