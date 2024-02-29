hw4: HW5sol.hs
	ghc HW5sol.hs -o hw
	./hw
ghci: HW5sol.hs
	ghci HW5sol.hs

verify: HW5sol.hs hw5verifier.hs
	ghc hw5verifier.hs -o ver
	./ver

clean:
	rm *.o *.hi hw verify