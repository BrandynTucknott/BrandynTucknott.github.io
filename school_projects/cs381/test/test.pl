plays(john,piano).
plays(john,cello).
plays(jill,cello).
plays(mike,piano).
plays(jane,guitar).

duet(Name1, Name2, Inst) :-
    plays(Name1, Inst), plays(Name2, Inst),
    dif(Name1, Name2).

talent(Name) :-
    plays(Name, Inst1), plays(Name, Inst2),
    Inst1 \= Inst2.

osu(b,a).
osu(d,z).
osu(d,s).
osu(e,z).
osu(f,q).

public(b,a).
public(d,v).
public(c,a).
public(e,z).
public(h,z).

book(X) :-
    osu(X, _).
book(X) :-
    public(X, _).

writtenBy(Author,Book) :- osu(Book,Author).
writtenBy(Author,Book) :- public(Book,Author).

teacher(joe). 
doctor(jane). 
healthy(joe). 
healthy(jane). 
wealthy(jane). 

lucky(X) :- healthy(X), wealthy(X).