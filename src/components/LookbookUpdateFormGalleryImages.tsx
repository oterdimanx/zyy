import Image from 'next/image'
import React from 'react'

type urlData = {
    lookbookDataUrl: [];
};

export default function LookbookUpdateFormGalleryImages({ lookbookDataUrl } : /*unresolved*/urlData ) {

    var jsxR = [];
    var ii = 0

    if(undefined != Object(lookbookDataUrl)['currentImagesArray'] && Object(lookbookDataUrl)['currentImagesArray'].length > 0){
        for (let index = 0; index < Object(lookbookDataUrl)['currentImagesArray'].length; index++) {
            const element = Object(lookbookDataUrl)['currentImagesArray'][index];

            if(element != ''){
                jsxR[index] = <Image src={element} alt="no Image" className="rounded inline-grid" width="170" height="170" sizes="100vw" key={ii++} />
            }
            
        }
    }

    return <div className="inline overflow-x-auto">{jsxR}</div>
    
}