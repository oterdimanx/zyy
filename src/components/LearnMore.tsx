
import React, { useState } from 'react'
import { useRouter } from 'next/navigation';

type productDataLink = {
    productLink: string,
};




export default function LearnMore({ productLink }: productDataLink) {
    const [Hovered, setHovered] = useState(false);
    const router = useRouter();
    const handleBoxToggle = () => setHovered(!Hovered);
      
    return (
        <div id="learn-more">
            <button onMouseEnter={handleBoxToggle} onMouseLeave={handleBoxToggle} className="learn-more ">
                <span className={`circle${Hovered ? " rollout" : ""}`} aria-hidden="true">
                    <span className="icon arrow"></span>
                </span>
                <span className="button-text" onClick={() => router.push(`/product/product-detail/${productLink}`)}>En savoir plus {Hovered}</span>
            </button>


        </div>
    )
}