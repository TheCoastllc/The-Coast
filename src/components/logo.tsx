import Image from 'next/image'

export const Logo = () => {
    return (
        <>
            <Image
                src="/footerlogodark.png"
                alt="Logo"
                width={150}
                height={150}
                className='dark:block hidden'
            />
            <Image
                src="/footerlogolight.png"
                alt="Logo"
                width={150}
                height={150}
                className='dark:hidden block'
            />

        </>

    )
}


