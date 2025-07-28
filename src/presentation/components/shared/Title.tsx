interface Props {
    text: string;
}

export const Title = ({text} : Props) => {
    return (
        <div>
            <h1 className="text-3xl font-bold font-LexendDeca-Bold text-cyan-900">
                {text}
            </h1>
            <hr className="my-4 border-b-cyan-900" />
        </div>
    )
}
