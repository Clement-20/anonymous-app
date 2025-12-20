import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function Home() {
        return (
                <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-slate-50">
                        <div className="max-w-md w-full space-y-6">

                                {/* Title Section */}
                                <div className="text-center space-y-2">
                                        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
                                                Ghost Note 👻
                                        </h1>
                                        <p className="text-slate-600 text-lg">
                                                Send anonymous texts, voice notes, and videos to friends.
                                        </p>
                                </div>

                                {/* The Card */}
                                <Card className="shadow-lg">
                                        <CardHeader>
                                                <CardTitle>Get Started</CardTitle>
                                                <CardDescription>
                                                        Create your profile link in seconds. No app download needed.
                                                </CardDescription>
                                        </CardHeader>
                                        <CardContent className="flex flex-col gap-3">

                                                {/* THIS IS THE LINK THAT WAS MISSING */}
                                                <Link href="/login" className="w-full">
                                                        <Button className="w-full text-lg py-6">
                                                                Create My Link
                                                        </Button>
                                                </Link>

                                                {/* THIS IS THE LINK THAT WAS MISSING */}
                                                <Link href="/login" className="w-full">
                                                        <Button variant="outline" className="w-full text-lg py-6">
                                                                I have an account
                                                        </Button>
                                                </Link>

                                        </CardContent>
                                </Card>

                        </div>
                </main>
        )
}
