import Footer from "@/components/shared/footer";
import Header from "@/components/shared/header";

export default function RootLayout({children}:{children: React.ReactNode}){
    return(
        <div className="flex flex-col min-h-screen">
            <Header/>
                <main className="flex-1 flex-col flex p-4">
                    {children}
                </main>
            <Footer/>
        </div>
    )
}