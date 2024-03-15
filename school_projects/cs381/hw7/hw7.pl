% course(course_number, course_name, credits)

course(cs101,python, 2).
course(mth210, calculusI, 5).
course(cs120, web_design, 3).
course(cs200, data_structures, 4).
course(cs210, algorithms, 4).
course(wrt101, basic_writing, 3).

% section(CRN, course_number)

section(1522,cs101).
section(1122,cs101).
section(2322,mth210).
section(2421,cs120).
section(8522,mth210).
section(1621,cs200).
section(7822,mth210).
section(2822,cs210).
section(3522,wrt101).

% place( CRN, building, time)

place(1522,owen102,10).
place(1122,dear118,11).
place(2322,with210,11).
place(2421,cov216,15).
place(8522,kec1001,13).
place(1621,cov216,14).
place(7822,kec1001,14).
place(2822,owen102,13).
place(3522,with210,15).

% enroll(sid, CRN)

enroll(122,1522).
enroll(122,8522).
enroll(150,1522).
enroll(150,2421).
enroll(212,7822).
enroll(300,2822).
enroll(300,8522).
enroll(310,3522).
enroll(310,8522).
enroll(310,1621).
enroll(175,2822).
enroll(175,7822).
enroll(175,3522).
enroll(410,1621).
enroll(410,7822).
enroll(113,3522).

% student(sid, student_name, major)

student(122, mary, cs).
student(150, john, math).
student(212, jim, ece).
student(300, lee, cs).
student(310, pat, cs).
student(175, amy, math).
student(410, john, cs).
student(113, zoe, ece).

% Problem 1 - College Database Application ====================================================================================
% Part A
schedule(Sid, CourseName, Building, Time) :- 
    enroll(Sid, CRN), section(CRN, CNum), 
    course(CNum, CourseName, _), place(CRN, Building, Time).

% Part B
schedule(Sid, Name, CourseName) :-
    student(Sid, Name, _),
    enroll(Sid, CRN), section(CRN, CNum), course(CNum, CourseName, _).

% Part C
offer(CNum, CourseName, CRN, Time) :-
    course(CNum, CourseName, _), section(CRN, CNum), place(CRN, _, Time).

% Part D
conflict(Sid, CRN1, CRN2) :-
    enroll(Sid, CRN1), enroll(Sid, CRN2),
    dif(CRN1, CRN2),
    place(CRN1, _, Time1), place(CRN2, _, Time2),
    Time1 == Time2.

% Part E
meet(Sid1, Sid2) :-
    dif(Sid1, Sid2),
    enroll(Sid1, CRN1), enroll(Sid2, CRN2),
    place(CRN1, Building, Time1), place(CRN2, Building, Time2),
    (Time1 =:= Time2 ; abs(Time1 - Time2) =:= 1). % =:= is arithmetic equality

% Part F
roster(CRN, Name) :-
    enroll(SID, CRN), student(SID, Name, _).

% Part G
highCredits(CourseName) :-
    course(_, CourseName, Credits),
    Credits >= 4.

% Part H
countClasses(SID, Name, NumClasses) :-
    student(SID, Name, _),
    findall(CRN, enroll(SID, CRN), CRNs),
    length(CRNs, NumClasses).






% Problem 2 - Path in a Weighted DAG ====================================================================================
% Graph
edge(a, b, 2).
edge(a, e, 1).
edge(a, d, 1).
edge(b, c, 6).
edge(b, e, 2).
edge(c, e, 9).
edge(d, c, 10).
edge(d, f, 7).
edge(e, f, 8).

% list all paths
dagPaths(Node, Node, [Node], 0) :- !.
dagPaths(S, F, [S | Tail], Cost) :-
    edge(S, Node, Weight),
    dagPaths(Node, F, Tail, RemainingWeight),
    Cost is Weight + RemainingWeight.
