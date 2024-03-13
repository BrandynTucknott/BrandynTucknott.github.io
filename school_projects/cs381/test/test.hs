main :: IO ()
main =
    do
        let x = 2 in
            print(let x=1 in x,x)
    