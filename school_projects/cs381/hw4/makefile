hw4: Homework4.hs
	ghc Homework4.hs -o hw

verify: Homework4.hs hw4Verifier.hs
	ghc hw4Verifier.hs -o ver
	./ver

clean:
	rm *.o *.hi hw verify